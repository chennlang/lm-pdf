import axios from 'axios'

// 配置 axios 基础设置
const api = axios.create({
  baseURL: '/api/pdf',
  timeout: 30000,
})

export interface PdfInfo {
  id: string
  filename: string
  total_pages: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  file_size: number
}

export interface PageInfo {
  page_number: number
  width: number
  height: number
}

export const pdfService = {
  // 上传 PDF
  async uploadPdf(file: File): Promise<PdfInfo> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  // 获取 PDF 列表
  async getPdfList(): Promise<PdfInfo[]> {
    const response = await api.get('/list')
    return response.data
  },

  // 获取 PDF 详情
  async getPdfInfo(pdfId: string): Promise<PdfInfo> {
    const response = await api.get(`/${pdfId}`)
    return response.data
  },

  // 获取 PDF 页面信息
  async getPdfPages(pdfId: string): Promise<{ total_pages: number; pages: PageInfo[] }> {
    const response = await api.get(`/${pdfId}/pages`)
    return response.data
  },

  // 获取页面图片 URL
  getPageImageUrl(pdfId: string, pageNumber: number): string {
    return `/api/pdf/${pdfId}/page/${pageNumber}/image/file`
  },

  // 获取页面图片 Blob
  async getPageImage(pdfId: string, pageNumber: number): Promise<Blob> {
    const response = await api.get(`/${pdfId}/page/${pageNumber}/image/file`, {
      responseType: 'blob',
    })
    return response.data
  },

  // 删除 PDF
  async deletePdf(pdfId: string): Promise<void> {
    await api.delete(`/${pdfId}`)
  },

  // 轮询 PDF 处理状态
  async pollPdfStatus(pdfId: string, interval = 2000): Promise<PdfInfo> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const pdfInfo = await this.getPdfInfo(pdfId)

          if (pdfInfo.status === 'completed') {
            resolve(pdfInfo)
          } else if (pdfInfo.status === 'failed') {
            reject(new Error('PDF processing failed'))
          } else {
            setTimeout(poll, interval)
          }
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  },
}