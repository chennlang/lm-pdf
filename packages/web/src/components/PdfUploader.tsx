import React, { useState } from 'react'
import { Upload, Button, message, Progress, Card, Space } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { pdfService } from '../services/pdfService'

const { Dragger } = Upload

interface UploadedFile {
  id: string
  name: string
  status: 'uploading' | 'done' | 'error'
  progress?: number
}

interface PdfUploaderProps {
  onUploadSuccess?: () => void
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      status: 'uploading',
      progress: 0
    }

    setFiles(prev => [...prev, newFile])
    setUploading(true)

    try {
      // 实际的上传逻辑
      const pdfInfo = await pdfService.uploadPdf(file)

      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id
            ? { ...f, status: 'done', progress: 100 }
            : f
        )
      )

      message.success(`${file.name} 上传成功`)

      // 调用上传成功回调
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id
            ? { ...f, status: 'error' }
            : f
        )
      )
      message.error(`${file.name} 上传失败`)
    } finally {
      setUploading(false)
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        message.error('只能上传 PDF 文件!')
        return false
      }

      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        message.error('文件大小不能超过 50MB!')
        return false
      }

      handleUpload(file)
      return false // Prevent automatic upload
    },
    showUploadList: false,
  }

  return (
    <Card title="PDF 文件上传" style={{ marginBottom: 20 }}>
      <Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽 PDF 文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个 PDF 文件上传，文件大小不能超过 50MB
        </p>
      </Dragger>

      {files.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>上传文件列表:</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            {files.map(file => (
              <div key={file.id} style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                backgroundColor: file.status === 'error' ? '#fff2f0' : '#f6ffed'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{file.name}</span>
                  <span style={{
                    color: file.status === 'done' ? '#52c41a' :
                           file.status === 'error' ? '#ff4d4f' : '#1890ff'
                  }}>
                    {file.status === 'done' ? '✓ 上传完成' :
                     file.status === 'error' ? '✗ 上传失败' : '上传中...'}
                  </span>
                </div>
                {file.status === 'uploading' && file.progress !== undefined && (
                  <Progress percent={file.progress} size="small" style={{ marginTop: 8 }} />
                )}
              </div>
            ))}
          </Space>
        </div>
      )}
    </Card>
  )
}

export default PdfUploader