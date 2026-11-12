import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import type { ChatMessage, ChatTurn, ScanMode, ScanRecord } from './types/scan.types'
import type { ApiStatus, AppView, User } from './types/user.types'
import { checkApiHealth } from './services/api'
import { getCurrentUser, logIn, logOut, register } from './services/authService'
import { chatAboutImage } from './services/chatService'
import { downloadPdfReport, scanImage } from './services/scannerService'
import useTheme from './hooks/useTheme'
import useScanHistory from './hooks/useScanHistory'
import { validateImage } from './utils/imageValidation'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Scanner from './pages/Scanner'
import ScanResults, { EmptyResults } from './pages/ScanResults'
import ScanHistory from './pages/ScanHistory'
import ImageChat from './pages/ImageChat'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const { darkMode, toggleTheme } = useTheme()
  const [view, setView] = useState<AppView>('overview')
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authError, setAuthError] = useState('')
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const previewUrlRef = useRef('')
  const [mode, setMode] = useState<ScanMode>('comprehensive')
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const { history, saveHistory, removeHistoryRecord: deleteHistoryRecord, exportHistory } = useScanHistory(user?.id ?? 'guest', setError)
  const [result, setResult] = useState<ScanRecord | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [search, setSearch] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const chatEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    checkApiHealth().then((health) => {
      if (active) setApiStatus(health.aiConfigured ? 'ready' : 'needs-config')
    }).catch(() => {
      if (active) setApiStatus('unavailable')
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    getCurrentUser().then((currentUser) => {
      if (active) setUser(currentUser)
    }).catch((caught: unknown) => {
      if (active) setAuthError(caught instanceof Error ? caught.message : 'Could not check your account.')
    }).finally(() => {
      if (active) setAuthReady(true)
    })
    return () => { active = false }
  }, [])

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isReplying])

  const replacePreview = (candidate?: File) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = candidate ? URL.createObjectURL(candidate) : ''
    setPreviewUrl(previewUrlRef.current)
  }

  const chooseFile = (candidate?: File, destination: AppView = 'scanner') => {
    if (!candidate) return
    const validation = validateImage(candidate)
    if (!validation.valid) {
      setError(validation.message)
      return
    }
    replacePreview(candidate)
    setFile(candidate)
    setError('')
    setResult(null)
    setMessages([])
    setView(destination)
  }

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0])
    event.target.value = ''
  }

  const onAssistantFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0], 'assistant')
    event.target.value = ''
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    chooseFile(event.dataTransfer.files[0])
  }

  const runScan = async () => {
    if (!file) {
      setError('Choose an image before starting a scan.')
      return
    }
    setIsScanning(true)
    setError('')
    try {
      const analysis = await scanImage(file, mode)
      const record: ScanRecord = {
        id: crypto.randomUUID(),
        filename: file.name,
        mode,
        createdAt: new Date().toISOString(),
        result: analysis,
      }
      setResult(record)
      saveHistory([record, ...history].slice(0, 50))
      setView('results')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The scan could not be completed.')
    } finally {
      setIsScanning(false)
    }
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = question.trim()
    if (!file || !text || isReplying) return
    const nextMessages = [...messages, { role: 'user' as const, text }]
    setMessages(nextMessages)
    setQuestion('')
    setIsReplying(true)
    setError('')
    try {
      const turns: ChatTurn[] = nextMessages.slice(-20).map(({ role, text: message }) => ({ role, text: message }))
      const answer = await chatAboutImage(file, turns)
      setMessages([...nextMessages, { role: 'assistant', text: answer }])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The assistant could not reply.')
      setMessages(nextMessages.slice(0, -1))
      setQuestion(text)
    } finally {
      setIsReplying(false)
    }
  }

  const startNewScan = () => {
    replacePreview()
    setFile(null)
    setResult(null)
    setMessages([])
    setError('')
    setView('scanner')
  }

  const startNewChat = () => {
    replacePreview()
    setFile(null)
    setMessages([])
    setQuestion('')
    setError('')
    fileInput.current?.click()
  }

  const openHistoryRecord = (record: ScanRecord) => {
    replacePreview()
    setError('')
    setResult(record)
    setFile(null)
    setView('results')
  }

  const removeHistoryRecord = (id: string) => {
    deleteHistoryRecord(id)
    if (result?.id === id) {
      setResult(null)
      setView('history')
    }
  }

  const handleLogin = async (_name: string, email: string, password: string) => {
    const signedInUser = await logIn({ email, password })
    setUser(signedInUser)
    setAuthError('')
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    const newUser = await register(name, { email, password })
    setUser(newUser)
    setAuthError('')
  }

  const handleLogout = async () => {
    try {
      await logOut()
      setUser(null)
      setAuthMode('login')
      setAuthError('')
    } catch (caught) {
      setAuthError(caught instanceof Error ? caught.message : 'Could not sign out.')
    }
  }

  if (!authReady) {
    return <main className="auth-shell"><p className="auth-loading">Checking your account…</p></main>
  }

  if (!user) {
    const onSwitch = () => {
      setAuthMode(authMode === 'login' ? 'signup' : 'login')
      setAuthError('')
    }
    return authMode === 'login'
      ? <Login onLogin={handleLogin} onSwitch={onSwitch} error={authError} />
      : <Register onRegister={handleRegister} onSwitch={onSwitch} error={authError} />
  }

  let page
  if (view === 'overview') {
    page = <Dashboard history={history} onScan={startNewScan} onHistory={() => setView('history')} onOpen={openHistoryRecord} onAssistant={() => setView('assistant')} />
  } else if (view === 'scanner') {
    page = <Scanner file={file} previewUrl={previewUrl} mode={mode} onModeChange={setMode} isDragging={isDragging} onDragChange={setIsDragging} fileInput={fileInput} onFileInput={onFileInput} onDrop={onDrop} onScan={runScan} isScanning={isScanning} error={error} onRemoveFile={() => { replacePreview(); setFile(null); setError('') }} />
  } else if (view === 'results') {
    page = result
      ? <ScanResults record={result} onBack={() => setView('history')} onNewScan={startNewScan} onAssistant={() => { setError(''); setMessages([]); setView('assistant') }} onPdf={() => { setError(''); void downloadPdfReport(result).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : 'The PDF report could not be downloaded.')) }} error={error} />
      : <EmptyResults onAction={startNewScan} />
  } else if (view === 'history') {
    page = <ScanHistory records={history} search={search} onSearchChange={setSearch} onOpen={openHistoryRecord} onDelete={removeHistoryRecord} onExport={exportHistory} onScan={startNewScan} />
  } else if (view === 'assistant') {
    page = <ImageChat file={file} previewUrl={previewUrl} messages={messages} question={question} onQuestionChange={setQuestion} onSend={sendMessage} isReplying={isReplying} onAttach={() => fileInput.current?.click()} fileInput={fileInput} onFileInput={onAssistantFileInput} bottomRef={chatEnd} error={error} onNewChat={startNewChat} />
  } else {
    page = <Settings darkMode={darkMode} onToggleTheme={toggleTheme} historyCount={history.length} onExport={exportHistory} />
  }

  return (
    <DashboardLayout
      view={view}
      user={user}
      apiStatus={apiStatus}
      darkMode={darkMode}
      historyCount={history.length}
      onNavigate={(nextView) => {
        if (nextView === 'scanner') startNewScan()
        else setView(nextView)
      }}
      onToggleTheme={toggleTheme}
      onHelp={() => setView('settings')}
      onLogout={handleLogout}
      authError={authError}
    >
      {page}
    </DashboardLayout>
  )
}

export default App
