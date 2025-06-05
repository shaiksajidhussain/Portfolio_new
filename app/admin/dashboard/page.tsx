'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from './ProjectForm';
import config from '@/components/config';

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

interface CarouselItem {
    _id: string;
    imageUrl: string;
    profilePic: string;
}

const AdminDashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showCarouselForm, setShowCarouselForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingCarousel, setEditingCarousel] = useState<CarouselItem | null>(null);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingCarousel, setIsLoadingCarousel] = useState(true);
    const [isSubmittingCarousel, setIsSubmittingCarousel] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [deletingCarouselId, setDeletingCarouselId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProjects();
        fetchCarouselItems();
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
            const response = await fetch(`${config.CURRENT_URL}/api/projects`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const fetchCarouselItems = async () => {
        setIsLoadingCarousel(true);
        try {
            const response = await fetch(`${config.CURRENT_URL}/api/carausel`);
            const data = await response.json();
            setCarouselItems(data);
        } catch (error) {
            console.error('Error fetching carousel items:', error);
        } finally {
            setIsLoadingCarousel(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setDeletingProjectId(id);
            try {
                await fetch(`${config.CURRENT_URL}/api/projects/${id}`, {
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

    const handleDeleteCarousel = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this carousel item?')) {
            setDeletingCarouselId(id);
            try {
                await fetch(`${config.CURRENT_URL}/api/carausel/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                fetchCarouselItems();
            } catch (error) {
                console.error('Error deleting carousel item:', error);
            } finally {
                setDeletingCarouselId(null);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const handleCarouselSubmit = async (formData: { imageUrl: string, profilePic: string }) => {
        setIsSubmittingCarousel(true);
        try {
            const method = editingCarousel ? 'PUT' : 'POST';
            const url = editingCarousel 
                ? `${config.CURRENT_URL}/api/carausel/${editingCarousel._id}`
                : `${config.CURRENT_URL}/api/carausel`;
            
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)
            });
            
            setShowCarouselForm(false);
            setEditingCarousel(null);
            fetchCarouselItems();
        } catch (error) {
            console.error('Error saving carousel item:', error);
        } finally {
            setIsSubmittingCarousel(false);
        }
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

                {/* Carousel Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Carousel Management</h2>
                        <button 
                            onClick={() => {
                                setEditingCarousel(null);
                                setShowCarouselForm(true);
                            }}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Add New Carousel Item
                        </button>
                    </div>

                    {isLoadingCarousel ? (
                        <div className="text-white text-center text-xl">Loading carousel items...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {carouselItems.map((item, index) => (
                                <div 
                                    key={item._id} 
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="mb-4">
                                        <h4 className="text-white font-semibold mb-2">Carousel Image:</h4>
                                        <img 
                                            src={item.imageUrl} 
                                            alt="Carousel item" 
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <h4 className="text-white font-semibold mb-2">Profile Picture:</h4>
                                        <img 
                                            src={item.profilePic} 
                                            alt="Profile picture" 
                                            className="w-32 h-32 object-cover rounded-full mx-auto"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => {
                                                setEditingCarousel(item);
                                                setShowCarouselForm(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteCarousel(item._id)}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={deletingCarouselId === item._id}
                                        >
                                            {deletingCarouselId === item._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Projects Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Project Management</h2>
                        <button 
                            onClick={() => {
                                setEditingProject(null);
                                setShowForm(true);
                            }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Add New Project
                        </button>
                    </div>

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
                </section>

                {/* Carousel Form Modal */}
                {showCarouselForm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                {editingCarousel ? 'Edit Carousel Item' : 'Add New Carousel Item'}
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleCarouselSubmit({
                                    imageUrl: formData.get('imageUrl') as string,
                                    profilePic: formData.get('profilePic') as string
                                });
                            }}>
                                <div className="mb-4">
                                    <label htmlFor="imageUrl" className="block text-white mb-2">Carousel Image URL</label>
                                    <input
                                        type="text"
                                        id="imageUrl"
                                        name="imageUrl"
                                        defaultValue={editingCarousel?.imageUrl}
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={isSubmittingCarousel}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="profilePic" className="block text-white mb-2">Profile Picture URL</label>
                                    <input
                                        type="text"
                                        id="profilePic"
                                        name="profilePic"
                                        defaultValue={editingCarousel?.profilePic}
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={isSubmittingCarousel}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isSubmittingCarousel}
                                    >
                                        {isSubmittingCarousel ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {editingCarousel ? 'Updating...' : 'Adding...'}
                                            </div>
                                        ) : (
                                            editingCarousel ? 'Update' : 'Add'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCarouselForm(false);
                                            setEditingCarousel(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-gray-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        disabled={isSubmittingCarousel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 