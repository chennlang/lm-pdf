import React, { useState } from 'react'
import { Layout } from 'antd'
import PdfUploader from './components/PdfUploader'
import PdfList from './components/PdfList'
import PdfViewer from './components/PdfViewer'
import { PdfInfo } from './services/pdfService'

const { Header, Content } = Layout

type ViewMode = 'list' | 'upload' | 'preview'

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedPdf, setSelectedPdf] = useState<PdfInfo | null>(null)

  const handleSelectPdf = (pdf: PdfInfo) => {
    setSelectedPdf(pdf)
    setViewMode('preview')
  }

  const handleBackToList = () => {
    setSelectedPdf(null)
    setViewMode('list')
  }

  const handleShowUpload = () => {
    setViewMode('upload')
  }

  const handleUploadSuccess = () => {
    // 上传成功后回到列表
    setViewMode('list')
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'upload':
        return (
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                返回列表
              </button>
            </div>
            <PdfUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        )
      case 'preview':
        return (
          <PdfViewer
            pdf={selectedPdf || undefined}
            onBack={handleBackToList}
          />
        )
      case 'list':
      default:
        return (
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleShowUpload}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                上传新PDF
              </button>
            </div>
            <PdfList onSelectPdf={handleSelectPdf} />
            <PdfViewer />
          </div>
        )
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>LM PDF Demo</h1>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </Content>
    </Layout>
  )
}

export default App