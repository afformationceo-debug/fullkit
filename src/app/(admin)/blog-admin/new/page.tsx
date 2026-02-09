import { BlogEditor } from "../blog-editor";

export const metadata = { title: "새 글 작성 | WhyKit Admin" };

export default function BlogNewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
      <BlogEditor mode="create" />
    </div>
  );
}
