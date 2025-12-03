import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Workflow, 
  Zap, 
  Settings, 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ArrowRight,
  ArrowLeft,
  Bot,
  Terminal,
  FileText,
  FolderKanban,
  CheckSquare,
  Sparkles,
  LayoutTemplate,
  Edit,
  Trash2,
  Save,
  X,
  Copy
} from 'lucide-react';
import { NeoButton, NeoCard, NeoInput, NeoBadge } from './components/ui/NeoComponents';
import { generateWorkflowFromPrompt, generateClientReport, generateProjectTemplate } from './services/geminiService';
import { Client, Workflow as WorkflowType, Project, ProjectTemplate, ProjectTask } from './types';

// --- MOCK DATA ---
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', company: 'Acme Inc.', status: 'Active', mrr: 5000, health: 92, projects: 2 },
  { id: '2', name: 'Stark Ind', company: 'Stark Industries', status: 'Onboarding', mrr: 12000, health: 100, projects: 1 },
  { id: '3', name: 'Wayne Ent', company: 'Wayne Enterprises', status: 'Active', mrr: 8500, health: 88, projects: 3 },
  { id: '4', name: 'Cyberdyne', company: 'Cyberdyne Systems', status: 'Churned', mrr: 0, health: 20, projects: 0 },
];

const MOCK_TEMPLATES: ProjectTemplate[] = [
  {
    id: 't1',
    name: 'Website Redesign',
    description: 'Complete overhaul of corporate website including SEO.',
    category: 'Development',
    tasks: ['Requirements Gathering', 'Wireframing', 'UI Design', 'Frontend Dev', 'Backend Dev', 'QA Testing', 'Launch']
  },
  {
    id: 't2',
    name: 'Social Media Campaign',
    description: 'Monthly content calendar and asset creation.',
    category: 'Marketing',
    tasks: ['Strategy Session', 'Content Calendar', 'Visual Asset Design', 'Copywriting', 'Approval', 'Scheduling', 'Analytics Report']
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    clientId: '1',
    name: 'Q4 Marketing Push',
    status: 'In Progress',
    deadline: '2023-12-15',
    progress: 65,
    tasks: []
  },
  {
    id: 'p2',
    clientId: '2',
    name: 'Jarvis Integration',
    status: 'Planning',
    deadline: '2024-01-20',
    progress: 10,
    tasks: []
  }
];

// --- SUB-VIEWS ---

const DashboardView = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Command Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, Admin. Systems are optimal.</p>
        </div>
        <NeoButton variant="accent1" icon={<Plus size={20} />}>New Project</NeoButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NeoCard className="bg-neo-accent2">
          <h3 className="text-sm font-bold uppercase mb-2 opacity-80">Total MRR</h3>
          <p className="text-4xl font-display font-bold">$25,500</p>
          <div className="mt-4 text-sm font-bold flex items-center gap-1">
            <span className="bg-white/30 px-2 py-1 border border-black rounded-none">+12%</span> vs last month
          </div>
        </NeoCard>
        <NeoCard>
          <h3 className="text-sm font-bold uppercase mb-2 opacity-60">Active Clients</h3>
          <p className="text-4xl font-display font-bold">14</p>
        </NeoCard>
        <NeoCard>
          <h3 className="text-sm font-bold uppercase mb-2 opacity-60">Agents Running</h3>
          <p className="text-4xl font-display font-bold">32</p>
        </NeoCard>
        <NeoCard>
          <h3 className="text-sm font-bold uppercase mb-2 opacity-60">Tasks Pending</h3>
          <p className="text-4xl font-display font-bold">8</p>
        </NeoCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold border-l-4 border-neo-accent3 pl-3">Live Activity</h2>
            <NeoButton variant="secondary" className="text-sm py-1 px-3">View All</NeoButton>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <NeoCard key={i} className="flex items-center justify-between p-4 group hover:translate-x-1 transition-transform cursor-pointer" noShadow>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 border-2 border-black dark:border-white flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Workflow "Lead Gen Alpha" triggered</h4>
                    <p className="text-sm text-gray-500">Processed 45 new leads successfully.</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-400">2m ago</span>
              </NeoCard>
            ))}
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold border-l-4 border-neo-accent1 pl-3">System Health</h2>
          <NeoCard className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="font-medium">API Latency</span>
               <span className="font-mono text-green-600 font-bold">45ms</span>
             </div>
             <div className="w-full bg-gray-200 h-3 border-2 border-black dark:border-white">
               <div className="bg-neo-accent1 h-full w-[90%]"></div>
             </div>

             <div className="flex justify-between items-center mt-4">
               <span className="font-medium">Error Rate</span>
               <span className="font-mono text-gray-600 font-bold">0.1%</span>
             </div>
             <div className="w-full bg-gray-200 h-3 border-2 border-black dark:border-white">
               <div className="bg-neo-accent3 h-full w-[5%]"></div>
             </div>
             
             <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-300">
               <NeoButton variant="secondary" className="w-full text-sm">System Logs</NeoButton>
             </div>
          </NeoCard>
        </div>
      </div>
    </div>
  );
};

const WorkflowBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any[] | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const steps = await generateWorkflowFromPrompt(prompt);
    setGeneratedWorkflow(steps);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold">Agent Workflow Builder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Describe a task, and our AI will architect the workflow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Input Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <NeoCard className="flex-1 flex flex-col gap-4">
            <h3 className="font-bold text-lg border-b-2 border-gray-100 pb-2">Prompt Configuration</h3>
            <textarea 
              className="w-full h-40 p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-neo-accent2"
              placeholder="e.g. Create a workflow that monitors Twitter for mentions of 'AgencyOS', analyzes sentiment with Gemini, and adds positive tweets to a Notion database."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex gap-2">
              <NeoButton 
                variant="accent2" 
                className="flex-1" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Architecting...' : 'Generate Workflow'}
              </NeoButton>
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">Templates</h4>
              <div className="flex flex-wrap gap-2">
                <span 
                  onClick={() => setPrompt("Scrape Google Maps for Italian restaurants in NYC and find emails.")}
                  className="px-3 py-1 border border-black dark:border-white text-xs cursor-pointer hover:bg-neo-accent1 hover:font-bold transition-all"
                >
                  Lead Scraper
                </span>
                <span 
                  onClick={() => setPrompt("Summarize daily TechCrunch articles and email me a digest.")}
                  className="px-3 py-1 border border-black dark:border-white text-xs cursor-pointer hover:bg-neo-accent1 hover:font-bold transition-all"
                >
                  News Digest
                </span>
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Visualizer Panel */}
        <div className="lg:col-span-8">
          <NeoCard className="h-full min-h-[500px] bg-slate-50 dark:bg-slate-900 overflow-hidden relative flex flex-col">
            <div className="absolute top-4 right-4 flex gap-2">
              <NeoBadge color="bg-white">Draft Mode</NeoBadge>
            </div>
            
            {!generatedWorkflow ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50">
                <Workflow size={64} strokeWidth={1} />
                <p className="mt-4 font-mono">Waiting for input...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-8 relative">
                 {/* Connecting Line (Simple CSS trick) */}
                 <div className="absolute left-8 top-8 bottom-8 w-1 bg-black/10 dark:bg-white/10 z-0"></div>

                 {generatedWorkflow.map((step, idx) => (
                   <div key={step.id} className="relative z-10 pl-16">
                     {/* Node Connector */}
                     <div className="absolute left-6 top-6 w-5 h-1 bg-black dark:bg-white"></div>
                     <div className="absolute left-[26px] top-[20px] w-3 h-3 bg-black dark:bg-white rounded-full"></div>

                     <div className={`
                        bg-white dark:bg-slate-800 border-2 border-black dark:border-white p-4 
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
                        hover:-translate-y-1 transition-transform
                        ${step.type === 'trigger' ? 'border-l-[8px] border-l-neo-accent2' : ''}
                        ${step.type === 'ai_agent' ? 'border-l-[8px] border-l-neo-accent1' : ''}
                        ${step.type === 'action' ? 'border-l-[8px] border-l-neo-accent3' : ''}
                     `}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{step.type}</span>
                          {step.tool && <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-mono border border-black/20">{step.tool}</span>}
                        </div>
                        <h3 className="font-bold text-lg">{step.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{step.description}</p>
                     </div>
                   </div>
                 ))}

                 <div className="pl-16 pt-4">
                    <NeoButton variant="primary" className="w-full">Activate Workflow</NeoButton>
                 </div>
              </div>
            )}
          </NeoCard>
        </div>
      </div>
    </div>
  );
};

const ClientManager = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [report, setReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async (client: Client) => {
    setLoadingReport(true);
    setReport('');
    const result = await generateClientReport(client.name, { mrr: client.mrr, projects: client.projects, health: client.health });
    setReport(result);
    setLoadingReport(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold">Client Database</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              className="pl-10 pr-4 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 focus:outline-none" 
              placeholder="Search clients..."
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <NeoButton variant="primary" icon={<Plus size={18}/>}>Add Client</NeoButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CLIENTS.map(client => (
          <NeoCard key={client.id} className="relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-black flex items-center justify-center font-bold text-xl">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <NeoBadge color={
                client.status === 'Active' ? 'bg-neo-accent1' : 
                client.status === 'Onboarding' ? 'bg-neo-accent2' : 'bg-gray-300'
              }>
                {client.status}
              </NeoBadge>
            </div>
            
            <h3 className="text-xl font-bold font-display">{client.company}</h3>
            <p className="text-sm text-gray-500 mb-6">{client.name}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold">MRR</p>
                <p className="font-mono font-bold">${client.mrr.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-bold">Health</p>
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-gray-200 border border-black">
                     <div className="h-full bg-black" style={{ width: `${client.health}%` }}></div>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <NeoButton 
                variant="secondary" 
                className="flex-1 text-sm py-2"
                onClick={() => { setSelectedClient(client.id); handleGenerateReport(client); }}
              >
                AI Report
              </NeoButton>
              <NeoButton variant="secondary" className="px-3"><MoreHorizontal size={16} /></NeoButton>
            </div>
            
            {selectedClient === client.id && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-20 p-6 flex flex-col border-2 border-black dark:border-white m-[-2px]">
                   <h4 className="font-bold mb-2 flex items-center gap-2">
                     <Bot size={18} className="text-neo-accent3"/> AI Analysis
                   </h4>
                   {loadingReport ? (
                       <p className="text-sm animate-pulse">Analyzing metrics...</p>
                   ) : (
                       <div className="text-sm space-y-2 overflow-y-auto flex-1">
                           <p>{report}</p>
                       </div>
                   )}
                   <NeoButton 
                    variant="primary" 
                    className="mt-4 text-sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedClient(null); }}
                   >
                       Close
                   </NeoButton>
                </div>
            )}
          </NeoCard>
        ))}
      </div>
    </div>
  );
};

const ProjectManager = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('templates');
  const [templates, setTemplates] = useState<ProjectTemplate[]>(MOCK_TEMPLATES);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  
  // Template Creation State
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templatePrompt, setTemplatePrompt] = useState('');
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

  // Template Editing State
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<ProjectTemplate | null>(null);

  const handleCreateTemplate = async () => {
    if (!templatePrompt.trim()) return;
    setIsGeneratingTemplate(true);
    const newTemplateData = await generateProjectTemplate(templatePrompt);
    
    if (newTemplateData) {
        const newTemplate: ProjectTemplate = {
            id: `t${Date.now()}`,
            name: newTemplateData.name || 'Untitled Template',
            description: newTemplateData.description || 'No description',
            category: newTemplateData.category || 'Strategy',
            tasks: newTemplateData.tasks || []
        };
        setTemplates([...templates, newTemplate]);
        setIsCreatingTemplate(false);
        setTemplatePrompt('');
    }
    setIsGeneratingTemplate(false);
  };

  const handleUseTemplate = (template: ProjectTemplate) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      clientId: '1', // Defaulting to first client for demo
      templateId: template.id,
      name: `${template.name} - New Client`,
      status: 'Planning',
      deadline: '2024-02-01',
      progress: 0,
      tasks: template.tasks.map((t, i) => ({ id: `task${i}`, title: t, status: 'todo' }))
    };
    setProjects([...projects, newProject]);
    setActiveTab('projects');
  };

  const handleEditTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template, tasks: [...template.tasks] });
  };
  
  const handleDuplicateTemplate = (template: ProjectTemplate) => {
    const newTemplate: ProjectTemplate = {
      ...template,
      id: `t${Date.now()}`,
      name: `Copy of ${template.name}`,
      tasks: [...template.tasks]
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleSaveTemplate = () => {
    if (!editedTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editedTemplate.id ? editedTemplate : t));
    setSelectedTemplate(null);
    setEditedTemplate(null);
  };

  const handleTaskChange = (index: number, value: string) => {
    if (!editedTemplate) return;
    const newTasks = [...editedTemplate.tasks];
    newTasks[index] = value;
    setEditedTemplate({...editedTemplate, tasks: newTasks});
  };

  const handleAddTask = () => {
    if (!editedTemplate) return;
    setEditedTemplate({...editedTemplate, tasks: [...editedTemplate.tasks, "New Task"]});
  };

  const handleDeleteTask = (index: number) => {
     if (!editedTemplate) return;
     const newTasks = editedTemplate.tasks.filter((_, i) => i !== index);
     setEditedTemplate({...editedTemplate, tasks: newTasks});
  };

  if (selectedTemplate && editedTemplate) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <NeoButton variant="secondary" onClick={() => setSelectedTemplate(null)} icon={<ArrowLeft size={20} />}>
                        Back
                    </NeoButton>
                    <h2 className="text-3xl font-display font-bold">Edit Template</h2>
                </div>
                <div className="flex gap-2">
                    <NeoButton variant="primary" onClick={handleSaveTemplate} icon={<Save size={20} />}>
                        Save Changes
                    </NeoButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <NeoCard>
                        <h3 className="font-bold text-lg border-b-2 border-gray-100 pb-2 mb-4">Template Details</h3>
                        <div className="space-y-4">
                            <NeoInput 
                                label="Template Name" 
                                value={editedTemplate.name}
                                onChange={(e) => setEditedTemplate({...editedTemplate, name: e.target.value})}
                            />
                            
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-bold text-sm uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white appearance-none focus:outline-none focus:ring-2 focus:ring-neo-accent2"
                                        value={editedTemplate.category}
                                        onChange={(e) => setEditedTemplate({...editedTemplate, category: e.target.value as any})}
                                    >
                                        <option value="Strategy">Strategy</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Development">Development</option>
                                        <option value="Design">Design</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ArrowRight size={16} className="rotate-90"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-bold text-sm uppercase tracking-wider">Description</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-neo-accent2 h-32 resize-none"
                                    value={editedTemplate.description}
                                    onChange={(e) => setEditedTemplate({...editedTemplate, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </NeoCard>
                    
                    <NeoCard className="bg-neo-accent1" noShadow>
                        <h4 className="font-bold mb-2">Quick Action</h4>
                        <p className="text-sm mb-4">Ready to start a project with this configured template?</p>
                        <NeoButton variant="primary" className="w-full" onClick={() => handleUseTemplate(editedTemplate)}>
                            Create Project
                        </NeoButton>
                    </NeoCard>
                </div>

                {/* Right Column: Tasks */}
                <div className="lg:col-span-2">
                    <NeoCard className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-2">
                            <h3 className="font-bold text-lg">Task Workflow</h3>
                            <NeoBadge>{editedTemplate.tasks.length} Steps</NeoBadge>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-2">
                            {editedTemplate.tasks.map((task, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-800 border-2 border-black dark:border-white font-mono font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 relative">
                                        <input 
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white focus:outline-none transition-colors"
                                            value={task}
                                            onChange={(e) => handleTaskChange(index, e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteTask(index)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            
                            {editedTemplate.tasks.length === 0 && (
                                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300">
                                    No tasks defined. Add one below.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t-2 border-gray-100">
                            <NeoButton variant="secondary" onClick={handleAddTask} className="w-full border-dashed" icon={<Plus size={18} />}>
                                Add New Task Step
                            </NeoButton>
                        </div>
                    </NeoCard>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold">Projects & Templates</h1>
        <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-white">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Active Projects
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Templates
          </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Template Card */}
          <div className={`
             bg-gray-50 dark:bg-slate-900/50 
             border-2 border-dashed border-gray-400 dark:border-gray-600 
             p-6 flex flex-col justify-center items-center gap-4
             hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors
             ${isCreatingTemplate ? 'border-solid border-black dark:border-white bg-white dark:bg-slate-900 ring-2 ring-neo-accent2' : ''}
          `}>
             {!isCreatingTemplate ? (
               <button onClick={() => setIsCreatingTemplate(true)} className="flex flex-col items-center text-gray-500 hover:text-black dark:hover:text-white">
                 <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mb-4">
                   <Plus size={32} />
                 </div>
                 <span className="font-bold text-lg">Create New Template</span>
                 <span className="text-sm">Use AI to generate a plan</span>
               </button>
             ) : (
               <div className="w-full h-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Sparkles size={16} className="text-neo-accent2" fill="currentColor"/> AI Generator
                    </h3>
                    <button onClick={() => setIsCreatingTemplate(false)} className="text-xs underline">Cancel</button>
                 </div>
                 <textarea 
                    className="w-full flex-1 p-3 text-sm bg-gray-50 dark:bg-slate-800 border-2 border-black dark:border-white resize-none focus:outline-none"
                    placeholder="e.g. '3-month SEO Audit plan' or 'Mobile App Launch strategy'"
                    value={templatePrompt}
                    onChange={(e) => setTemplatePrompt(e.target.value)}
                 />
                 <NeoButton 
                   variant="accent2" 
                   className="w-full text-sm py-2"
                   onClick={handleCreateTemplate}
                   disabled={isGeneratingTemplate}
                 >
                   {isGeneratingTemplate ? 'Generating...' : 'Generate Template'}
                 </NeoButton>
               </div>
             )}
          </div>

          {/* Existing Templates */}
          {templates.map(template => (
             <NeoCard key={template.id} className="flex flex-col h-full relative group">
                <div className="flex justify-between items-start mb-3">
                   <NeoBadge color={
                     template.category === 'Development' ? 'bg-blue-200' :
                     template.category === 'Marketing' ? 'bg-pink-200' :
                     template.category === 'Design' ? 'bg-purple-200' : 'bg-green-200'
                   }>{template.category}</NeoBadge>
                   
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleDuplicateTemplate(template); }}
                       className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
                       title="Duplicate"
                     >
                       <Copy size={18} />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleEditTemplate(template); }}
                       className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
                       title="Edit"
                     >
                       <Edit size={18} />
                     </button>
                   </div>
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{template.description}</p>
                
                <div className="bg-gray-100 dark:bg-slate-800 p-3 border border-black dark:border-white mb-4">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">{template.tasks.length} Tasks Included:</p>
                  <ul className="text-xs space-y-1">
                     {template.tasks.slice(0, 3).map((t, i) => (
                        <li key={i} className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                           <span className="truncate">{t}</span>
                        </li>
                     ))}
                     {template.tasks.length > 3 && <li className="text-gray-400 italic pl-3">+{template.tasks.length - 3} more</li>}
                  </ul>
                </div>

                <NeoButton variant="primary" className="w-full mt-auto" onClick={() => handleUseTemplate(template)}>
                   Use Template
                </NeoButton>
             </NeoCard>
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.map(project => (
             <NeoCard key={project.id} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-neo-accent1 border-2 border-black flex items-center justify-center">
                      <FolderKanban size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                         <span className="flex items-center gap-1"><Users size={14}/> Client #{project.clientId}</span>
                         <span className="flex items-center gap-1"><CheckSquare size={14}/> {project.tasks?.length || 0} tasks</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="text-right">
                      <p className="text-xs font-bold uppercase text-gray-500">Deadline</p>
                      <p className="font-mono font-medium">{project.deadline}</p>
                   </div>
                   <div className="w-32">
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 border-2 border-black">
                         <div className="h-full bg-neo-accent3" style={{width: `${project.progress}%`}}></div>
                      </div>
                   </div>
                   <NeoButton variant="secondary" icon={<ArrowRight size={18}/>}>Open</NeoButton>
                </div>
             </NeoCard>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN LAYOUT ---

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const NavButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setCurrentView(id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 font-medium transition-all
        border-r-4
        ${currentView === id 
          ? 'bg-black text-white border-neo-accent1 dark:bg-white dark:text-black dark:border-neo-accent1' 
          : 'hover:bg-gray-100 dark:hover:bg-slate-800 border-transparent text-gray-600 dark:text-gray-400'}
      `}
    >
      <Icon size={20} />
      <span className="uppercase tracking-wide text-sm font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-neo-bg dark:bg-neo-darkBg text-neo-primary dark:text-neo-secondary font-sans transition-colors duration-200">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r-2 border-black dark:border-white z-50 flex flex-col">
        <div className="p-6 border-b-2 border-black dark:border-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neo-accent1 border-2 border-black"></div>
            <h1 className="font-display font-bold text-2xl tracking-tighter">AGENCY<span className="text-neo-accent3">OS</span></h1>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <NavButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavButton id="projects" label="Projects" icon={FolderKanban} />
          <NavButton id="clients" label="Clients" icon={Users} />
          <NavButton id="workflow" label="Agent Builder" icon={Bot} />
          <NavButton id="integrations" label="Integrations" icon={Zap} />
          <NavButton id="knowledge" label="Knowledge" icon={FileText} />
        </nav>

        <div className="p-4 border-t-2 border-black dark:border-white">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-none border-2 border-black bg-gray-200 overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover"/>
            </div>
            <div>
              <p className="font-bold text-sm">Alex Chen</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
          <button 
             onClick={() => setDarkMode(!darkMode)}
             className="w-full py-2 border-2 border-black dark:border-white flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800 font-bold text-xs uppercase"
          >
             {darkMode ? <Sun size={16}/> : <Moon size={16}/>}
             {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'projects' && <ProjectManager />}
        {currentView === 'clients' && <ClientManager />}
        {currentView === 'workflow' && <WorkflowBuilder />}
        {currentView === 'integrations' && (
           <div className="flex flex-col items-center justify-center h-[60vh]">
              <Terminal size={64} className="mb-4 text-gray-300"/>
              <h2 className="text-2xl font-bold font-display">Integrations Hub</h2>
              <p className="text-gray-500 mt-2">Connect your tools (Zapier, Make, n8n) here.</p>
              <NeoButton variant="primary" className="mt-6">Connect New API</NeoButton>
           </div>
        )}
        {currentView === 'knowledge' && (
           <div className="flex flex-col items-center justify-center h-[60vh]">
              <FileText size={64} className="mb-4 text-gray-300"/>
              <h2 className="text-2xl font-bold font-display">Knowledge Base</h2>
              <p className="text-gray-500 mt-2">Agentic retrieval augmented generation (RAG) system.</p>
              <NeoButton variant="accent1" className="mt-6">Upload Documents</NeoButton>
           </div>
        )}
      </main>

    </div>
  );
};

export default App;