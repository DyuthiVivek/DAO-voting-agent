"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Settings, Search, Bot, Vote, Shield, Zap, Wallet, TrendingUp, Clock, CheckCircle, XCircle, ExternalLink, Brain, Activity, AlertTriangle, Info, ArrowUpRight, Filter, MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react'

interface DAO {
  id: string
  name: string
  address: string
  network: string
  description: string
  memberCount: number
  treasuryValue: string
  agentEnabled: boolean
  preferences: {
    riskTolerance: 'low' | 'medium' | 'high'
    votingStrategy: 'conservative' | 'moderate' | 'aggressive'
    autoVoteThreshold: number
    categories: string[]
  }
  lastActivity: string
}

interface Transaction {
  id: string
  daoId: string
  daoName: string
  type: 'vote' | 'proposal' | 'delegation'
  action: string
  timestamp: string
  reasoning: string
  outcome: 'success' | 'pending' | 'failed'
  details: {
    proposalTitle?: string
    voteChoice?: 'for' | 'against' | 'abstain'
    confidence?: number
    gasUsed?: string
  }
}

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: string
}

export default function TrustlessDAOApp() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your DAO assistant. I can help you understand proposals, analyze voting patterns, explain agent decisions, and answer questions about your DAOs. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [daos, setDAOs] = useState<DAO[]>([
    {
      id: '1',
      name: 'Uniswap DAO',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      network: 'Ethereum',
      description: 'Decentralized exchange protocol governance',
      memberCount: 12847,
      treasuryValue: '$2.4B',
      agentEnabled: true,
      preferences: {
        riskTolerance: 'medium',
        votingStrategy: 'moderate',
        autoVoteThreshold: 75,
        categories: ['Protocol Upgrades', 'Treasury Management']
      },
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'Compound DAO',
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      network: 'Ethereum',
      description: 'Lending protocol governance',
      memberCount: 8934,
      treasuryValue: '$890M',
      agentEnabled: false,
      preferences: {
        riskTolerance: 'low',
        votingStrategy: 'conservative',
        autoVoteThreshold: 85,
        categories: ['Risk Parameters', 'New Markets']
      },
      lastActivity: '1 day ago'
    }
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      daoId: '1',
      daoName: 'Uniswap DAO',
      type: 'vote',
      action: 'Voted FOR proposal #47',
      timestamp: '2 hours ago',
      reasoning: 'Analysis shows this proposal aligns with treasury optimization goals. The proposed fee structure changes have a 78% probability of increasing protocol revenue while maintaining competitive rates. Risk assessment indicates minimal impact on user adoption.',
      outcome: 'success',
      details: {
        proposalTitle: 'Adjust Fee Structure for V4 Pools',
        voteChoice: 'for',
        confidence: 78,
        gasUsed: '0.0023 ETH'
      }
    },
    {
      id: '2',
      daoId: '1',
      daoName: 'Uniswap DAO',
      type: 'vote',
      action: 'Voted AGAINST proposal #46',
      timestamp: '1 day ago',
      reasoning: 'The proposed governance token distribution mechanism lacks sufficient safeguards against centralization. Historical data from similar implementations shows a 65% risk of whale accumulation. Recommended waiting for improved proposal with better distribution caps.',
      outcome: 'success',
      details: {
        proposalTitle: 'New Token Distribution Mechanism',
        voteChoice: 'against',
        confidence: 82,
        gasUsed: '0.0019 ETH'
      }
    },
    {
      id: '3',
      daoId: '2',
      daoName: 'Compound DAO',
      type: 'proposal',
      action: 'Analyzed proposal #23',
      timestamp: '3 days ago',
      reasoning: 'Agent analysis complete but auto-voting disabled for this DAO. Recommendation: ABSTAIN. The proposal introduces new collateral types with insufficient liquidity data. Suggest requesting 30-day market analysis before implementation.',
      outcome: 'pending',
      details: {
        proposalTitle: 'Add New Collateral Assets',
        confidence: 45
      }
    }
  ])

  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null)
  const [showAddDAO, setShowAddDAO] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const connectWallet = () => {
    setConnectedWallet("0x1234...5678")
  }

  const addDAO = (daoData: Partial<DAO>) => {
    const newDAO: DAO = {
      id: Date.now().toString(),
      name: daoData.name || '',
      address: daoData.address || '',
      network: daoData.network || 'Ethereum',
      description: daoData.description || '',
      memberCount: 0,
      treasuryValue: '$0',
      agentEnabled: false,
      preferences: {
        riskTolerance: 'medium',
        votingStrategy: 'moderate',
        autoVoteThreshold: 75,
        categories: []
      },
      lastActivity: 'Just added'
    }
    setDAOs([...daos, newDAO])
    setShowAddDAO(false)
  }

  const toggleAgentForDAO = (daoId: string) => {
    setDAOs(daos.map(dao => 
      dao.id === daoId 
        ? { ...dao, agentEnabled: !dao.agentEnabled }
        : dao
    ))
  }

  const updateDAOPreferences = (daoId: string, preferences: DAO['preferences']) => {
    setDAOs(daos.map(dao => 
      dao.id === daoId 
        ? { ...dao, preferences }
        : dao
    ))
  }

  const searchDAOInfo = async (daoName: string) => {
    // Simulate web search
    setSearchResults([
      {
        title: `${daoName} - Official Documentation`,
        url: `https://${daoName.toLowerCase()}.org/docs`,
        snippet: `Official documentation and governance information for ${daoName}...`
      },
      {
        title: `${daoName} Governance Forum`,
        url: `https://forum.${daoName.toLowerCase()}.org`,
        snippet: `Community discussions and proposal debates for ${daoName}...`
      },
      {
        title: `${daoName} Analytics Dashboard`,
        url: `https://analytics.${daoName.toLowerCase()}.org`,
        snippet: `Real-time metrics and treasury analytics for ${daoName}...`
      }
    ])
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    // Simulate bot response
    try {
      const response = await fetch('http://localhost:5000/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt: chatInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, botMessage]);
      setIsTyping(false)
    } catch (error) {
       console.error('Error calling agent API:', error);
       setIsTyping(false);
    }
  }

  const generateBotResponse = (input: string, daos: DAO[], transactions: Transaction[]): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('dao') && lowerInput.includes('how many')) {
      return `You currently have ${daos.length} DAOs in your portfolio. ${daos.filter(d => d.agentEnabled).length} of them have agent voting enabled.`
    }
    
    if (lowerInput.includes('agent') && lowerInput.includes('vote')) {
      const agentVotes = transactions.filter(t => t.type === 'vote').length
      return `Your agent has cast ${agentVotes} votes so far. The success rate is 94.2%. Would you like me to explain the reasoning behind any specific vote?`
    }
    
    if (lowerInput.includes('uniswap')) {
      const uniswapDAO = daos.find(d => d.name.toLowerCase().includes('uniswap'))
      if (uniswapDAO) {
        return `Uniswap DAO is one of your tracked DAOs. It has ${uniswapDAO.memberCount.toLocaleString()} members and a treasury of ${uniswapDAO.treasuryValue}. Agent voting is ${uniswapDAO.agentEnabled ? 'enabled' : 'disabled'}. Would you like to know more about recent proposals or agent activity?`
      }
    }
    
    if (lowerInput.includes('proposal') || lowerInput.includes('vote')) {
      return `I can help you understand proposals and voting decisions. Your agent analyzes proposals based on risk tolerance, voting strategy, and confidence thresholds. Recent votes include fee structure adjustments and token distribution mechanisms. Which specific proposal would you like to discuss?`
    }
    
    if (lowerInput.includes('risk') || lowerInput.includes('strategy')) {
      return `Your DAOs have different risk strategies: some are set to conservative (high confidence required), others to moderate (balanced approach). You can adjust these in the DAO preferences. Would you like me to recommend optimal settings based on your voting history?`
    }
    
    if (lowerInput.includes('gas') || lowerInput.includes('cost')) {
      return `Your agent has saved approximately 0.047 ETH ($89.23) in gas costs this month through optimized voting timing and batch transactions. The average gas cost per vote is 0.002 ETH.`
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return `I can help you with:\n• Explaining agent voting decisions and reasoning\n• Analyzing DAO proposals and their implications\n• Recommending optimal voting strategies\n• Providing DAO statistics and performance metrics\n• Helping configure agent preferences\n• Answering questions about governance processes\n\nWhat would you like to know more about?`
    }
    
    return `I understand you're asking about "${input}". I can help you with DAO governance, agent voting decisions, proposal analysis, and strategy optimization. Could you be more specific about what you'd like to know?`
  }

  const agentEnabledDAOs = daos.filter(dao => dao.agentEnabled)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">DAO Agent</h1>
              </div>
              <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-700">
                <Zap className="h-3 w-3 mr-1" />
                {agentEnabledDAOs.length} Active
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {connectedWallet ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">{connectedWallet}</Badge>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connected
                  </Button>
                </div>
              ) : (
                <Button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total DAOs</CardTitle>
              <Shield className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{daos.length}</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">{agentEnabledDAOs.length} agent-enabled</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Agent Votes</CardTitle>
              <Bot className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{transactions.filter(t => t.type === 'vote').length}</div>
              <p className="text-xs text-gray-400">
                <span className="text-blue-400">2 this week</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94.2%</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">Above average</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Gas Saved</CardTitle>
              <Zap className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0.047 ETH</div>
              <p className="text-xs text-gray-400">
                <span className="text-green-400">$89.23</span> this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="daos" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">My DAOs</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent-Enabled DAOs */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Bot className="h-5 w-5" />
                    <span>Agent-Enabled DAOs</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">DAOs where the agent can vote on your behalf</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentEnabledDAOs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No DAOs have agent voting enabled</p>
                      <p className="text-sm">Enable agent voting in the DAOs tab</p>
                    </div>
                  ) : (
                    agentEnabledDAOs.map((dao) => (
                      <div key={dao.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-800/30">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-700 text-gray-300">{dao.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{dao.name}</p>
                            <p className="text-sm text-gray-400">{dao.network}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-700">
                            <Zap className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                          <p className="text-xs text-gray-400 mt-1">{dao.lastActivity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Agent Activity */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5" />
                    <span>Recent Agent Activity</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">Latest actions taken by your agent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-start space-x-3 p-3 border border-gray-700 rounded-lg bg-gray-800/30">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        transaction.outcome === 'success' ? 'bg-green-400' :
                        transaction.outcome === 'pending' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{transaction.action}</p>
                        <p className="text-xs text-gray-400">{transaction.daoName} • {transaction.timestamp}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {transaction.reasoning.slice(0, 100)}...
                        </p>
                      </div>
                      <Badge variant={
                        transaction.outcome === 'success' ? 'secondary' :
                        transaction.outcome === 'pending' ? 'outline' :
                        'destructive'
                      } className={
                        transaction.outcome === 'success' ? 'bg-green-900/50 text-green-300 border-green-700' :
                        transaction.outcome === 'pending' ? 'border-yellow-600 text-yellow-300' :
                        'bg-red-900/50 text-red-300 border-red-700'
                      }>
                        {transaction.outcome}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My DAOs</h2>
              <Dialog open={showAddDAO} onOpenChange={setShowAddDAO}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add DAO
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New DAO</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a DAO to start managing your governance participation
                    </DialogDescription>
                  </DialogHeader>
                  <AddDAOForm onSubmit={addDAO} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daos.map((dao) => (
                <Card key={dao.id} className="relative bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-700 text-gray-300">{dao.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base text-white">{dao.name}</CardTitle>
                          <CardDescription className="text-gray-400">{dao.network}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {dao.agentEnabled && (
                          <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-700">
                            <Bot className="h-3 w-3 mr-1" />
                            Agent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">{dao.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Members</p>
                        <p className="font-medium text-white">{dao.memberCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Treasury</p>
                        <p className="font-medium text-white">{dao.treasuryValue}</p>
                      </div>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={dao.agentEnabled}
                          onCheckedChange={() => toggleAgentForDAO(dao.id)}
                        />
                        <Label className="text-sm text-gray-300">Agent Voting</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => searchDAOInfo(dao.name)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">DAO Preferences - {dao.name}</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Configure how the agent should behave for this DAO
                              </DialogDescription>
                            </DialogHeader>
                            <DAOPreferencesForm 
                              dao={dao} 
                              onSave={(preferences) => updateDAOPreferences(dao.id, preferences)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Search className="h-5 w-5" />
                    <span>Search Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-3 border border-gray-700 rounded-lg bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-blue-400">{result.title}</h4>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{result.snippet}</p>
                      <p className="text-xs text-gray-500 mt-2">{result.url}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Agent Transactions</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All DAOs</SelectItem>
                    {daos.map(dao => (
                      <SelectItem key={dao.id} value={dao.id}>{dao.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.outcome === 'success' ? 'bg-green-400' :
                          transaction.outcome === 'pending' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                        <div>
                          <CardTitle className="text-lg text-white">{transaction.action}</CardTitle>
                          <CardDescription className="text-gray-400">{transaction.daoName} • {transaction.timestamp}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          transaction.type === 'vote' ? 'default' :
                          transaction.type === 'proposal' ? 'secondary' :
                          'outline'
                        } className={
                          transaction.type === 'vote' ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
                          transaction.type === 'proposal' ? 'bg-purple-900/50 text-purple-300 border-purple-700' :
                          'border-gray-600 text-gray-300'
                        }>
                          {transaction.type}
                        </Badge>
                        <Badge variant={
                          transaction.outcome === 'success' ? 'secondary' :
                          transaction.outcome === 'pending' ? 'outline' :
                          'destructive'
                        } className={
                          transaction.outcome === 'success' ? 'bg-green-900/50 text-green-300 border-green-700' :
                          transaction.outcome === 'pending' ? 'border-yellow-600 text-yellow-300' :
                          'bg-red-900/50 text-red-300 border-red-700'
                        }>
                          {transaction.outcome}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 mt-0.5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium mb-2 text-white">Agent Reasoning:</p>
                          <p className="text-sm text-gray-300">{transaction.reasoning}</p>
                        </div>
                      </div>
                    </div>
                    
                    {transaction.details && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {transaction.details.proposalTitle && (
                          <div>
                            <p className="text-gray-400">Proposal</p>
                            <p className="font-medium text-white">{transaction.details.proposalTitle}</p>
                          </div>
                        )}
                        {transaction.details.voteChoice && (
                          <div>
                            <p className="text-gray-400">Vote</p>
                            <p className="font-medium capitalize text-white">{transaction.details.voteChoice}</p>
                          </div>
                        )}
                        {transaction.details.confidence && (
                          <div>
                            <p className="text-gray-400">Confidence</p>
                            <p className="font-medium text-white">{transaction.details.confidence}%</p>
                          </div>
                        )}
                        {transaction.details.gasUsed && (
                          <div>
                            <p className="text-gray-400">Gas Used</p>
                            <p className="font-medium text-white">{transaction.details.gasUsed}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Global Agent Settings</CardTitle>
                <CardDescription className="text-gray-400">Configure default behavior for your DAO agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base text-white">Enable Agent Notifications</Label>
                      <p className="text-sm text-gray-400">Get notified when the agent takes actions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base text-white">Auto-approve Low Risk Votes</Label>
                      <p className="text-sm text-gray-400">Automatically approve votes with high confidence</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <Label className="text-white">Default Risk Tolerance</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low">Low - Conservative approach</SelectItem>
                        <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                        <SelectItem value="high">High - Aggressive approach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot */}
      {!chatOpen && (
        <Button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {chatOpen && (
        <div className={`fixed bottom-15 right-6 z-50 transition-all duration-300 ${
          chatMinimized ? 'w-80 h-12' : 'w-[500px] h-[500px]'
        }`}>
          <Card className="h-full bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-sm text-white">DAO Assistant</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {chatMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatOpen(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            
            {!chatMinimized && (
              <>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[380px] p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-100'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your DAOs, proposals, or agent decisions..."
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isTyping}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}



// Add DAO Form Component
function AddDAOForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    network: 'Ethereum',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">DAO Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., Uniswap DAO"
          required
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-white">Contract Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="0x..."
          required
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="network" className="text-white">Network</Label>
        <Select value={formData.network} onValueChange={(value) => setFormData({...formData, network: value})}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="Hedera">Hedera</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Brief description of the DAO"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add DAO</Button>
    </form>
  )
}

// DAO Preferences Form Component
function DAOPreferencesForm({ dao, onSave }: { dao: DAO, onSave: (preferences: DAO['preferences']) => void }) {
  const [preferences, setPreferences] = useState(dao.preferences)

  const handleSave = () => {
    onSave(preferences)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-white">Risk Tolerance</Label>
        <Select 
          value={preferences.riskTolerance} 
          onValueChange={(value: any) => setPreferences({...preferences, riskTolerance: value})}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="low">Low - Conservative voting</SelectItem>
            <SelectItem value="medium">Medium - Balanced approach</SelectItem>
            <SelectItem value="high">High - Aggressive voting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Voting Strategy</Label>
        <Select 
          value={preferences.votingStrategy} 
          onValueChange={(value: any) => setPreferences({...preferences, votingStrategy: value})}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="conservative">Conservative - High confidence required</SelectItem>
            <SelectItem value="moderate">Moderate - Balanced decisions</SelectItem>
            <SelectItem value="aggressive">Aggressive - Quick decisions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Auto-vote Threshold ({preferences.autoVoteThreshold}%)</Label>
        <Input
          type="range"
          min="50"
          max="95"
          value={preferences.autoVoteThreshold}
          onChange={(e) => setPreferences({...preferences, autoVoteThreshold: parseInt(e.target.value)})}
          className="w-full bg-gray-700 border-gray-600"
        />
        <p className="text-xs text-gray-400">
          Agent will only vote automatically when confidence is above this threshold
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Preferred Categories</Label>
        <div className="grid grid-cols-2 gap-2">
          {['Protocol Upgrades', 'Treasury Management', 'Risk Parameters', 'New Markets', 'Governance', 'Partnerships'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={category}
                checked={preferences.categories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({...preferences, categories: [...preferences.categories, category]})
                  } else {
                    setPreferences({...preferences, categories: preferences.categories.filter(c => c !== category)})
                  }
                }}
                className="rounded border-gray-600 bg-gray-700"
              />
              <Label htmlFor={category} className="text-sm text-gray-300">{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <DialogClose asChild>
        <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
      </DialogClose>
    </div>
  )
}
