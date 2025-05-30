import { NoProjectsIcon } from "@/components/ui/icons";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const ProjectGrid = ({ projects, onViewDetails }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10 py-10">
                <NoProjectsIcon />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} onViewDetails={onViewDetails} />
            ))}
        </div>
    );
};