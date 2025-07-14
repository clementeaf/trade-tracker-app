import boto3
from botocore.exceptions import ClientError
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

class DynamoDBService:
    def __init__(self, table_name: str = "trade-tracker-trades"):
        self.dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
        self.table = self.dynamodb.Table(table_name)
    
    def create_trade(self, trade_data: Dict[str, Any]) -> Dict[str, Any]:
        """Crear un nuevo trade en DynamoDB"""
        try:
            # Generar ID único
            trade_id = self._get_next_id()
            
            # Preparar item para DynamoDB
            item = {
                'id': trade_id,
                'par': trade_data['par'],
                'precio_apertura': float(trade_data['precio_apertura']),
                'take_profit': float(trade_data['take_profit']),
                'stop_loss': float(trade_data['stop_loss']),
                'fecha_apertura': trade_data.get('fecha_apertura', datetime.now().isoformat()),
                'fecha_cierre': trade_data.get('fecha_cierre'),
                'motivo_cierre': trade_data.get('motivo_cierre'),
                'observaciones': trade_data.get('observaciones'),
                'imagenes': trade_data.get('imagenes', []),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Insertar en DynamoDB
            self.table.put_item(Item=item)
            
            return item
            
        except ClientError as e:
            print(f"Error creando trade: {e}")
            raise e
    
    def get_trade(self, trade_id: int) -> Optional[Dict[str, Any]]:
        """Obtener un trade específico por ID"""
        try:
            response = self.table.get_item(Key={'id': trade_id})
            return response.get('Item')
        except ClientError as e:
            print(f"Error obteniendo trade: {e}")
            raise e
    
    def get_all_trades(self) -> List[Dict[str, Any]]:
        """Obtener todos los trades"""
        try:
            response = self.table.scan()
            trades = response.get('Items', [])
            
            # Si hay más items, continuar escaneando
            while 'LastEvaluatedKey' in response:
                response = self.table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
                trades.extend(response.get('Items', []))
            
            # Ordenar por fecha de creación (más reciente primero)
            trades.sort(key=lambda x: x.get('created_at', ''), reverse=True)
            
            return trades
            
        except ClientError as e:
            print(f"Error obteniendo trades: {e}")
            raise e
    
    def update_trade(self, trade_id: int, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Actualizar un trade existente"""
        try:
            # Preparar expresión de actualización
            update_expression = "SET "
            expression_attribute_values = {}
            expression_attribute_names = {}
            
            for key, value in updates.items():
                if key != 'id':  # No permitir actualizar el ID
                    attr_name = f"#{key}"
                    attr_value = f":{key}"
                    
                    update_expression += f"{attr_name} = {attr_value}, "
                    expression_attribute_names[attr_name] = key
                    expression_attribute_values[attr_value] = value
            
            # Agregar updated_at
            update_expression += "#updated_at = :updated_at"
            expression_attribute_names["#updated_at"] = "updated_at"
            expression_attribute_values[":updated_at"] = datetime.now().isoformat()
            
            # Remover la coma extra
            update_expression = update_expression.rstrip(", ")
            
            response = self.table.update_item(
                Key={'id': trade_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW"
            )
            
            return response.get('Attributes')
            
        except ClientError as e:
            print(f"Error actualizando trade: {e}")
            raise e
    
    def delete_trade(self, trade_id: int) -> bool:
        """Eliminar un trade"""
        try:
            self.table.delete_item(Key={'id': trade_id})
            return True
        except ClientError as e:
            print(f"Error eliminando trade: {e}")
            raise e
    
    def get_trades_by_par(self, par: str) -> List[Dict[str, Any]]:
        """Obtener trades por par usando el índice secundario"""
        try:
            response = self.table.query(
                IndexName='par-index',
                KeyConditionExpression='#par = :par',
                ExpressionAttributeNames={'#par': 'par'},
                ExpressionAttributeValues={':par': par}
            )
            
            trades = response.get('Items', [])
            
            # Si hay más items, continuar consultando
            while 'LastEvaluatedKey' in response:
                response = self.table.query(
                    IndexName='par-index',
                    KeyConditionExpression='#par = :par',
                    ExpressionAttributeNames={'#par': 'par'},
                    ExpressionAttributeValues={':par': par},
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                trades.extend(response.get('Items', []))
            
            return trades
            
        except ClientError as e:
            print(f"Error obteniendo trades por par: {e}")
            raise e
    
    def _get_next_id(self) -> int:
        """Obtener el siguiente ID disponible"""
        try:
            # Escanear para obtener el ID más alto
            response = self.table.scan(
                ProjectionExpression='#id',
                ExpressionAttributeNames={'#id': 'id'}
            )
            
            max_id = 0
            for item in response.get('Items', []):
                item_id = item.get('id', 0)
                if isinstance(item_id, int) and item_id > max_id:
                    max_id = item_id
            
            return max_id + 1
            
        except ClientError as e:
            print(f"Error obteniendo siguiente ID: {e}")
            # Si hay error, usar timestamp como fallback
            return int(datetime.now().timestamp())
    
    def close_trade(self, trade_id: int, fecha_cierre: str, motivo_cierre: str) -> Optional[Dict[str, Any]]:
        """Cerrar un trade"""
        updates = {
            'fecha_cierre': fecha_cierre,
            'motivo_cierre': motivo_cierre
        }
        return self.update_trade(trade_id, updates)

# Instancia global del servicio
dynamodb_service = DynamoDBService() 