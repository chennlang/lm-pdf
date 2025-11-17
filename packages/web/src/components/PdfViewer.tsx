import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Space, Spin, Typography, Alert, message } from 'antd'
import { ArrowLeftOutlined, ReloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { EasyPdfProvider, EasyPdfHeader, EasyPdfViewer, Page } from '@lm-pdf/easy-pdf'
import { pdfService, PdfInfo } from '../services/pdfService'

const { Title } = Typography

interface PdfViewerProps {
  pdf?: PdfInfo
  onBack?: () => void
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdf, onBack }) => {
  const [currentPdf, setCurrentPdf] = useState<PdfInfo | null>(pdf || null)
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const emitterRef = useRef<any>(null)

  useEffect(() => {
    if (pdf) {
      setCurrentPdf(pdf)
      loadPdfPages(pdf.id)
    } else {
      setCurrentPdf(null)
      setPages([])
      setError('')
    }
  }, [pdf])

  const loadPdfPages = async (pdfId: string) => {
    try {
      setLoading(true)
      setError('')
      const pageData = await pdfService.getPdfPages(pdfId)

      // 转换为组件需要的 Page 格式
      const formattedPages: Page[] = pageData.pages.map((page, index) => ({
        id: page.page_number,
        page: page.page_number,
        width: page.width,
        height: page.height
      }))

      setPages(formattedPages)
    } catch (error) {
      console.error('Failed to load PDF pages:', error)
      setError('加载PDF页面信息失败')
      message.error('加载PDF页面信息失败')
    } finally {
      setLoading(false)
    }
  }

  const loadPageImage = async (page: Page): Promise<string> => {
    try {
      if (!currentPdf) return ''
      // 调用后端 API 获取页面图片
      const imageBlob = await pdfService.getPageImage(currentPdf.id, page.page)
      return URL.createObjectURL(imageBlob)
    } catch (error) {
      console.error('Failed to load page image:', error)
      message.error(`加载第 ${page.page} 页失败`)
      return ''
    }
  }

  const handleRectClick = (block: any, page: Page) => {
    console.log('Rect clicked:', block, page)
  }

  const handlePageChange = (page?: Page) => {
    console.log('Page changed:', page)
  }

  const handleRefresh = () => {
    if (currentPdf) {
      loadPdfPages(currentPdf.id)
    }
  }

  if (!currentPdf) {
    return (
      <Card title="PDF 预览">
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <FilePdfOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>请从列表中选择一个PDF文件进行预览</div>
          <div style={{ fontSize: '14px', color: '#ccc' }}>您也可以先上传新的PDF文件</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card
        title={
          <Space>
            {onBack && <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} />}
            {currentPdf.filename}
          </Space>
        }
        extra={<Button icon={<ReloadOutlined />} onClick={handleRefresh}>重试</Button>}
      >
        <Alert
          message="预览错误"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    )
  }

  return (
    <Card
      title={
        <Space>
          {onBack && <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} />}
          <span>{currentPdf.filename}</span>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
            size="small"
          >
            刷新
          </Button>
        </Space>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#666' }}>正在加载PDF页面...</div>
        </div>
      ) : (
        <EasyPdfProvider
          pages={pages}
          gap={20}
          defaultPage={1}
          loadPageImage={loadPageImage}
          onRectClick={handleRectClick}
          onPageChange={handlePageChange}
          emitterRef={emitterRef}
        >
          <div style={{ marginBottom: 16 }}>
            <EasyPdfHeader />
          </div>
          <div style={{
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            position: 'relative'
          }}>
            {pages.length === 0 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#999'
              }}>
                <div>暂无页面数据</div>
              </div>
            )}
            <EasyPdfViewer />
          </div>
        </EasyPdfProvider>
      )}
    </Card>
  )
}

export default PdfViewer