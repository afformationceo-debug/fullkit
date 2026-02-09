"use client";

export function ShareButton({ url }: { url: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다.");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("링크가 복사되었습니다.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
    >
      링크 복사
    </button>
  );
}
