'use client'
import { useState, useEffect } from 'react';
import config from '@/components/config';

interface Member {
    name: string;
    img: string;
    linkedin: string;
    github: string;
}

interface Project {
    _id?: string;
    title: string;
    description: string;
    image?: string;
    tags: string[];
    category?: string;
    github?: string;
    webapp?: string;
    member?: Member[];
}

interface ProjectFormProps {
    project?: Project;
    onClose: () => void;
    onSubmit: () => void;
}

const ProjectForm = ({ project, onClose, onSubmit }: ProjectFormProps) => {
    const [formData, setFormData] = useState<Project>({
        title: '',
        description: '',
        image: '',
        tags: [],
        category: '',
        github: '',
        webapp: '',
        member: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData(project);
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const method = project ? 'PUT' : 'POST';
            const url = project 
                ? `${config.CURRENT_URL}/api/projects/${project._id}`
                : `${config.CURRENT_URL}/api/projects`;
            
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)
            });
            
            onSubmit();
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({
            ...prev,
            tags
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image URL</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags (comma-separated)</label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-300">GitHub URL</label>
                <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div>
                <label htmlFor="webapp" className="block text-sm font-medium text-gray-300">Web App URL</label>
                <input
                    type="url"
                    id="webapp"
                    name="webapp"
                    value={formData.webapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : (project ? 'Update' : 'Add')} Project
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-gray-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProjectForm; 