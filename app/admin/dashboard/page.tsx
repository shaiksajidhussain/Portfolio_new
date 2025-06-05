'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from './ProjectForm';

interface Member {
    name: string;
    img: string;
    linkedin: string;
    github: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    image?: string;
    tags?: string[];
    category?: string;
    github?: string;
    webapp?: string;
    member?: Member[];
}

const AdminDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProjects();
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        }
    };

    const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const response = await fetch('https://portfolio-backend-six-ruby.vercel.app/api/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setDeletingProjectId(id);
            try {
                await fetch(`https://portfolio-backend-six-ruby.vercel.app/api/projects/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            } finally {
                setDeletingProjectId(null);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white animate-fade-in">Admin Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Logout
                    </button>
                </header>

                <button 
                    onClick={() => {
                        setEditingProject(null);
                        setShowForm(true);
                    }}
                    className="mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Add New Project
                </button>

                {showForm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
                            <ProjectForm 
                                project={editingProject}
                                onClose={() => {
                                    setShowForm(false);
                                    setEditingProject(null);
                                }}
                                onSubmit={() => {
                                    setShowForm(false);
                                    setEditingProject(null);
                                    fetchProjects();
                                }}
                            />
                        </div>
                    </div>
                )}

                {isLoadingProjects ? (
                    <div className="text-white text-center text-xl">Loading projects...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div 
                                key={project._id} 
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                                <p className="text-gray-300 mb-4">{project.description.substring(0, 100)}...</p>
                                
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tech, techIndex) => (
                                            <span 
                                                key={techIndex}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => {
                                            setEditingProject(project);
                                            setShowForm(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project._id)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={deletingProjectId === project._id}
                                    >
                                        {deletingProjectId === project._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 