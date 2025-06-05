'use client'
import { useState, useEffect } from 'react';

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

// Define a type for the form data that matches the input structure
interface ProjectFormData extends Omit<Project, 'tags'> {
    tags: string; // tags will be handled as a string in the form
}

interface ProjectFormProps {
    project?: Project | null;
    onClose: () => void;
    onSubmit: () => void;
}

const ProjectForm = ({ project, onClose, onSubmit }: ProjectFormProps) => {
    const [formData, setFormData] = useState<Partial<ProjectFormData>>({
        title: '',
        description: '',
        image: '',
        tags: '', // Initialize as string
        category: '',
        github: '',
        webapp: '',
        member: [{
            name: '',
            img: '',
            linkedin: '',
            github: '',
        }],
    });
    const [error, setError] = useState<string | null>(null); // Allow null for no error
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                tags: project.tags?.join(', ') || '', // Convert array to string for input, handle undefined
                member: project.member && project.member.length > 0 ? project.member : [{
                    name: '',
                    img: '',
                    linkedin: '',
                    github: '',
                }],
            });
        }
    }, [project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            tags: e.target.value,
        }));
    };

    const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedMembers = [...(formData.member || [])];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value
        };
        setFormData(prev => ({
            ...prev,
            member: updatedMembers
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        setIsLoading(true); // Set loading to true on submit
        try {
            // Prepare data for API call: convert tags string to array
            const projectData: Partial<Project> = {
                ...formData,
                tags: (formData.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Ensure tags is string before split
                // Ensure member is an array, even if empty, and has the correct structure
                member: formData.member && formData.member.length > 0 && formData.member[0].name !== '' ? formData.member : [],
            };

            const url = project?._id
                ? `https://portfolio-backend-six-ruby.vercel.app/api/projects/${project._id}`
                : 'https://portfolio-backend-six-ruby.vercel.app/api/projects';

            const method = project?._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Failed to save project');
            }

            onSubmit();
        } catch (err: unknown) { // Use unknown for safer error handling
            // Check if the error is an instance of Error to access the message property
            if (err instanceof Error) {
                setError(err.message);
            } else {
                // Handle cases where the caught value is not an Error object
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false); // Set loading to false regardless of outcome
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <h2 className="text-2xl font-bold text-white mb-4 text-center">{project ? 'Edit Project' : 'Add New Project'}</h2>
             {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm animate-shake">
                    {error}
                </div>
            )}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                    Title
                </label>
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

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px] resize-vertical"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                    Image URL
                </label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
                    Tags (comma-separated)
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleTagsChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

             <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="github" className="block text-sm font-medium text-gray-300">
                    GitHub URL
                </label>
                <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="webapp" className="block text-sm font-medium text-gray-300">
                    Live URL
                </label>
                <input
                    type="url"
                    id="webapp"
                    name="webapp"
                    value={formData.webapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
            </div>

            {/* Team Member Fields */}
            {/* <h3 className="text-xl font-bold text-white mt-6 mb-3">Team Member (Currently only one supported)</h3>
            {formData.member?.map((member, index) => (
                 <div key={index} className="space-y-2 border border-white/10 p-4 rounded-lg">
                    <div className="space-y-2">
                         <label htmlFor={`member-name-${index}`} className="block text-sm font-medium text-gray-300">Member Name</label>
                         <input
                             type="text"
                             id={`member-name-${index}`}
                             name="name"
                             value={member.name}
                             onChange={(e) => handleMemberChange(e, index)}
                             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                         />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={`member-img-${index}`} className="block text-sm font-medium text-gray-300">Member Image URL</label>
                         <input
                             type="url"
                             id={`member-img-${index}`}
                             name="img"
                             value={member.img}
                             onChange={(e) => handleMemberChange(e, index)}
                             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                         />
                    </div>
                     <div className="space-y-2">
                        <label htmlFor={`member-linkedin-${index}`} className="block text-sm font-medium text-gray-300">Member LinkedIn URL</label>
                         <input
                             type="url"
                             id={`member-linkedin-${index}`}
                             name="linkedin"
                             value={member.linkedin}
                             onChange={(e) => handleMemberChange(e, index)}
                             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                         />
                    </div>
                     <div className="space-y-2">
                        <label htmlFor={`member-github-${index}`} className="block text-sm font-medium text-gray-300">Member GitHub URL</label>
                         <input
                             type="url"
                             id={`member-github-${index}`}
                             name="github"
                             value={member.github}
                             onChange={(e) => handleMemberChange(e, index)}
                             className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                         />
                     </div>
                 </div>
            ))} */}

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading} // Disable button when loading
                >
                    {isLoading ? (project ? 'Updating...' : 'Adding...') : (project ? 'Update Project' : 'Add Project')}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-gray-500/25 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading} // Disable button when loading
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProjectForm; 