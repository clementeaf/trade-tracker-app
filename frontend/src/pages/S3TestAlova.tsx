import React, { useState, useEffect } from 'react';
import { ImageUploadAlova } from '../components/molecules/ImageUploadAlova';
import { S3FileList } from '../components/molecules/S3FileList';
import { s3ServiceAlova } from '../services/s3ServiceAlova';
import { tradeServiceAlova } from '../services/tradeServiceAlova';
import type { S3File } from '../services/s3ServiceAlova';
import type { Trade } from '../services/tradeServiceAlova';

export const S3TestAlova: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<S3File | null>(null);
  const [bucketInfo, setBucketInfo] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [tradesLoading, setTradesLoading] = useState(false);

  const handleUploadSuccess = (fileKey: string, url: string) => {
    console.log('Archivo subido exitosamente:', { fileKey, url });
    alert(`Archivo subido exitosamente!\nClave: ${fileKey}\nURL: ${url}`);
  };

  const handleUploadError = (error: string) => {
    console.error('Error subiendo archivo:', error);
    alert(`Error subiendo archivo: ${error}`);
  };

  const handleFileSelect = (file: S3File) => {
    setSelectedFile(file);
  };

  const loadBucketInfo = async () => {
    try {
      setLoading(true);
      const info = await s3ServiceAlova.getBucketInfo();
      setBucketInfo(info);
    } catch (error) {
      console.error('Error cargando información del bucket:', error);
      alert('Error cargando información del bucket');
    } finally {
      setLoading(false);
    }
  };

  const loadTrades = async () => {
    try {
      setTradesLoading(true);
      const tradesData = await tradeServiceAlova.getTrades();
      setTrades(tradesData);
    } catch (error) {
      console.error('Error cargando trades:', error);
      alert('Error cargando trades');
    } finally {
      setTradesLoading(false);
    }
  };

  const createTestTrade = async () => {
    try {
      const newTrade = await tradeServiceAlova.createTrade({
        par: 'BTC/USDT',
        precio_apertura: 65000,
        take_profit: 67000,
        stop_loss: 64000,
      });
      alert(`Trade creado exitosamente con ID: ${newTrade.id}`);
      loadTrades(); // Recargar lista
    } catch (error) {
      console.error('Error creando trade:', error);
      alert('Error creando trade');
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Prueba de S3 con AlovaJS</h1>
      
      {/* Información del Bucket */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Información del Bucket (AlovaJS)</h2>
        <button
          onClick={loadBucketInfo}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar Información del Bucket'}
        </button>
        
        {bucketInfo && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-semibold mb-2">Detalles del Bucket:</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Nombre:</strong> {bucketInfo.bucket_name}</li>
              <li><strong>Región:</strong> {bucketInfo.region}</li>
              <li><strong>Estado:</strong> {bucketInfo.status}</li>
              <li><strong>URL:</strong> <a href={bucketInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{bucketInfo.url}</a></li>
            </ul>
          </div>
        )}
      </div>

      {/* Prueba de Trades */}
      <div className="mb-8 p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Prueba de Trades (AlovaJS)</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={loadTrades}
            disabled={tradesLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {tradesLoading ? 'Cargando...' : 'Cargar Trades'}
          </button>
          <button
            onClick={createTestTrade}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Crear Trade de Prueba
          </button>
        </div>
        
        {trades.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Trades existentes:</h3>
            <div className="space-y-2">
              {trades.map((trade) => (
                <div key={trade.id} className="p-3 bg-white rounded border">
                  <p><strong>ID:</strong> {trade.id}</p>
                  <p><strong>Par:</strong> {trade.par}</p>
                  <p><strong>Precio Apertura:</strong> ${trade.precio_apertura}</p>
                  <p><strong>Take Profit:</strong> ${trade.take_profit}</p>
                  <p><strong>Stop Loss:</strong> ${trade.stop_loss}</p>
                  <p><strong>Fecha:</strong> {new Date(trade.fecha_apertura).toLocaleString('es-ES')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subir Imagen */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Imagen (AlovaJS)</h2>
        <ImageUploadAlova
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="max-w-md"
        />
      </div>

      {/* Lista de Archivos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivos en S3 (AlovaJS)</h2>
        <S3FileList
          onFileSelect={handleFileSelect}
          className="max-w-2xl"
        />
      </div>

      {/* Archivo Seleccionado */}
      {selectedFile && (
        <div className="mb-8 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Archivo Seleccionado</h2>
          <div className="space-y-2">
            <p><strong>Clave:</strong> {selectedFile.key}</p>
            <p><strong>Tamaño:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p><strong>Última modificación:</strong> {new Date(selectedFile.last_modified).toLocaleString('es-ES')}</p>
            <p><strong>URL:</strong> <a href={selectedFile.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{selectedFile.url}</a></p>
            
            {/* Vista previa de la imagen */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Vista previa:</h3>
              <img
                src={selectedFile.url}
                alt="Vista previa"
                className="max-w-xs max-h-48 object-contain border rounded"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <p className="hidden text-sm text-gray-500 mt-2">
                No se puede mostrar la vista previa de este archivo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 