"use client";

import { deleteProject } from "@/lib/actions/project-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export function ProjectDelete({ projectId }: { projectId: string }) {
  return (
    <DeleteButton
      onDelete={() => deleteProject(projectId)}
      redirectTo="/projects"
      label="프로젝트 삭제"
      confirmMessage="프로젝트를 삭제하면 관련 태스크, 마일스톤, 요구사항도 함께 삭제됩니다. 계속하시겠습니까?"
    />
  );
}
