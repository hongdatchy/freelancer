"use client";

import { useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export default function Service() {

  useEffect(() => {
    fetch(
      "http://localhost:1234/api/triggers/search?schedName=job-manager-core&page=0&size=100&sort=t.next_fire_time%2Casc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          triggerName: "",
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  const docs = [
    {
      uri: "https://7d92-2402-800-61cd-b013-a46b-8c7f-ab3a-74db.ngrok-free.app/uploads/BAI_5_LA_ANH_BAO_NHIEU_TUOI_PHAN_1_262f9cf901.pptx",
      fileType: "pptx",
    },
  ];

  return (
    <section className="flex justify-center px-4 py-10">
      <div className="max-w-5xl w-full flex flex-col gap-6">

        {/* CANVA */}
        <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
          <iframe
            loading="lazy"
            className="w-full h-full border-0"
            src="https://www.canva.com/design/DAHG7iXIOao/-HB2cayUeXqr0AmR8J96hw/view?embed"
            allowFullScreen
          />
        </div>

        {/* PDF / PPT */}
        <div className="w-full h-[600px] bg-white rounded-lg shadow p-4">
          <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            style={{ height: "100%" }}
          />
        </div>

      </div>
    </section>
  );
}