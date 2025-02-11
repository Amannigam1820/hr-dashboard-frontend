import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import mammoth from "mammoth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import html2pdf from "html2pdf.js"; 

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ViewResume Component
const ViewResume = () => {
  const { id } = useParams();
  const [resumeContent, setResumeContent] = useState("");
  const [resumeURL, setResumeURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();
  const editorRef = useRef(null);

  // Fetch resume URL from backend
  const fetchResumeURL = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/employee/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setResumeURL(data.hr.resume);
      setName(data.hr.name);
    } catch (error) {
      console.error("Error fetching resume URL:", error);
    }
  };

  // Handle file upload (DOCX or PDF)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle DOCX file
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then((result) => {
              setResumeContent(result.value);
            })
            .catch((error) => {
              console.error("Error converting Word document:", error);
            });
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          
          let extractedHtml = "";
          
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1 });
          
            const textContent = await page.getTextContent();
          
            const textHtml = textContent.items
              .map((item) => {
                const { str, transform, width } = item;
                const x = transform[4];
                const y = viewport.height - transform[5];
                const fontSize = Math.abs(transform[0]);
          
                const style = `
                  position: absolute;
                  left: ${x}px;
                  top: ${y}px;
                  font-size: ${fontSize}px;
                  white-space: pre;
                `;
          
                return `<span style="${style}">${str}</span>`;
              })
              .join("");
          
            extractedHtml += `
              <div style="position: relative; width: ${viewport.width}px; height: ${viewport.height}px; overflow: hidden; margin-bottom: 20px; page-break-before: always; background: white; border: 2px black;">
                ${textHtml}
              </div>`;
          }
          
          // Wrap extracted HTML with a div to center-align content
          setResumeContent(`<div style="text-align: center;">${extractedHtml}</div>`);
        } catch (error) {
          console.error("Error extracting PDF content:", error);
        }
        
      }
    }
  };

  //Fetch resume content from URL if available
  const fetchResumeContent = async () => {
    if (resumeURL) {
      try {
        const response = await fetch(resumeURL);
        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        let text = "";
        for (const page of pages) {
          const pageContent = await page.getTextContent();
          text += pageContent.items.map((item) => item.str).join(" ") + "\n\n";
        }

        setResumeContent(text);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or parsing PDF:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchResumeURL();
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (resumeURL) {
      fetchResumeContent();
    }
  }, [resumeURL]);

 // Generate PDF from the edited resume content
  
 const generateUpdatedPdf = () => {
  if (editorRef.current) {
    const editorContent = editorRef.current.getContent();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorContent;
    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
      scale: 2, // Increase scale for better resolution
      width: 165 * 3.7795275591, // Convert A4 width (210mm) to px (approx)
      height: 235 * 3.7795275591, // Convert A4 height (297mm) to px (approx)
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`${name}_resume.pdf`);

      document.body.removeChild(tempDiv);
    });
  }
};


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {loading ? (
        <p className="text-center text-xl text-gray-700">Loading resume...</p>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Edit Resume
          </h2>

          <div className="flex justify-center mb-6">
            <input
              type="file"
              accept=".docx, .pdf"
              onChange={handleFileChange}
              className="p-3 border rounded-lg bg-white shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Editor
            apiKey="9hgzjx0g28z1qy1jg1o0a75ld9eq9x53hqoiqg8f5mtu1xyl"
            value={resumeContent}
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={(content) => setResumeContent(content)}
            init={{
             
              plugins: [
                "anchor",
                "autolink",
                "charmap",
                "codesample",
                "emoticons",
                "image",
                "link",
                "lists",
                "media",
                "searchreplace",
                "table",
                "visualblocks",
                "wordcount",
                "checklist",
                "mediaembed",
                "casechange",
                "export",
                "formatpainter",
                "pageembed",
                "a11ychecker",
                "permanentpen",
                "powerpaste",
                "advtable",
                "advcode",
                "editimage",
                "advtemplate",
                "ai",
                "mentions",
                "tinycomments",
                "tableofcontents",
                "footnotes",
                "mergetags",
                "autocorrect",
                "typography",
                "inlinecss",
                "markdown",
                "importword",
                "exportword",
                "exportpdf",
                "importpdf",
                "autoresize",
                "save",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat" |
                "save",
               
              paste_word_valid_elements:
                "strong,em,u,a,ul,ol,li,p,h1,h2,h3,h4,h5,h6,table,tr,th,td,br",
              paste_word_import_styles: true,
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant")
                ),
            
            }}
            className="bg-white rounded-lg shadow-lg p-2 "
          />

          <div className="flex justify-center mt-8">
            <button
              onClick={generateUpdatedPdf}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
              Generate Resume
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewResume;
