import React, { useState, useEffect } from 'react'
import { Card, List, Button, Tag, Space, Typography, Empty, Spin, message } from 'antd'
import { FilePdfOutlined, EyeOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { pdfService, PdfInfo } from '../services/pdfService'

const { Title, Text, Paragraph } = Typography

interface PdfListProps {
  onSelectPdf: (pdf: PdfInfo) => void
}

const PdfList: React.FC<PdfListProps> = ({ onSelectPdf }) => {
  const [pdfs, setPdfs] = useState<PdfInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPdfs = async () => {
    try {
      if (refreshing) {
        setRefreshing(true)
      }
      const pdfList = await pdfService.getPdfList()
      setPdfs(pdfList)
    } catch (error) {
      console.error('Failed to fetch PDF list:', error)
      message.error('获取PDF列表失败')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDelete = async (pdf: PdfInfo) => {
    try {
      await pdfService.deletePdf(pdf.id)
      message.success('PDF删除成功')
      fetchPdfs() // 刷新列表
    } catch (error) {
      console.error('Failed to delete PDF:', error)
      message.error('PDF删除失败')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'processing'
      case 'pending':
        return 'default'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'processing':
        return '处理中'
      case 'pending':
        return '等待中'
      case 'failed':
        return '失败'
      default:
        return status
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [])

  return (
    <Card
      title={
        <Space>
          <FilePdfOutlined />
          <span>PDF 文件列表</span>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={fetchPdfs}
            loading={refreshing}
            size="small"
          >
            刷新
          </Button>
        </Space>
      }
      extra={<Text type="secondary">{pdfs.length} 个文件</Text>}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>加载中...</div>
        </div>
      ) : pdfs.length === 0 ? (
        <Empty
          description="暂无PDF文件"
          style={{ padding: '40px' }}
        />
      ) : (
        <List
          dataSource={pdfs}
          renderItem={(pdf) => (
            <List.Item
              key={pdf.id}
              actions={[
                <Button
                  key="view"
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => onSelectPdf(pdf)}
                >
                  预览
                </Button>,
                <Button
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(pdf)}
                >
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />}
                title={
                  <Space>
                    <Text strong>{pdf.filename}</Text>
                    <Tag color={getStatusColor(pdf.status)}>
                      {getStatusText(pdf.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">
                      页数: {pdf.total_pages} | 大小: {formatFileSize(pdf.file_size)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      上传时间: {formatDate(pdf.created_at)}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default PdfList