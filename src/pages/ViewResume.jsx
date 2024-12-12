import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting employee ID from URL params
import { Editor } from "@tinymce/tinymce-react"; // TinyMCE editor
import mammoth from "mammoth"; // Import mammoth for Word-to-HTML conversion
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";

const ViewResume = () => {
  const { id } = useParams(); // Get employee ID from route params
  const [resumeContent, setResumeContent] = useState(""); // Content for editing
  const [resumeURL, setResumeURL] = useState(""); // URL of the resume
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();

  // Fetch the resume URL using the provided API
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

  // Handle file upload and convert Word to HTML using Mammoth
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then((result) => {
            setResumeContent(result.value); // Set the Word file content to the editor
          })
          .catch((error) => {
            console.error("Error converting Word document:", error);
          });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Fetch resume content if the URL is available
  const fetchResumeContent = async () => {
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
  };

  useEffect(() => {
    // Fetch resume URL first, then fetch its content
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

  // Generate updated PDF from the content of the TinyMCE editor
  const generateUpdatedPdf = async () => {
    try {
      // Get the content of the editor (TinyMCE editor inside an iframe)
      const editorContent = document.querySelector(".tox-edit-area iframe").contentDocument.body;

      // Temporarily remove red underlines caused by spellcheck
      const redUnderlines = editorContent.querySelectorAll("span[style*='color: red;'][style*='text-decoration: underline;']");
      redUnderlines.forEach((span) => {
        // Remove the red underline by clearing the styles
        span.style.textDecoration = "none";  // Remove underline
        span.style.color = "black";  // Change color to black or any neutral color
      });

      // Capture the editor content as a high-resolution image
      const canvas = await html2canvas(editorContent, { scale: 2 });
      const imageData = canvas.toDataURL("image/png");

      // Calculate the desired dimensions for the PDF page (A4 size in points)
      const pdfWidth = 530;  // A4 width in points (in px: 210mm * 72 DPI)
      const leftMargin = 25;  // Left margin
      const rightMargin = 25;  // Right margin

      // Calculate the dynamic PDF height based on content
      const contentHeight = canvas.height * (pdfWidth / canvas.width);  // Scale height to maintain aspect ratio
      const pdfHeight = contentHeight < 500 ? 500 : contentHeight; // Ensure the minimum height of A4 page (650px)

      // Create a PDF document using jsPDF with dynamically adjusted height
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight], // Use dynamic height
      });

      // Adjust the width for margins
      const scaledWidth = pdfWidth - leftMargin - rightMargin;  // Adjusted width after margins
      const scale = scaledWidth / canvas.width;  // Scale to fit the adjusted width
      const scaledHeight = canvas.height * scale;  // Calculate height based on the scale

      // Add the image to the PDF, with margins taken into account
      pdf.addImage(imageData, "PNG", leftMargin, 0, scaledWidth, scaledHeight);

      // Save the PDF
      pdf.save(`${name}_resume.pdf`);

      // Optionally, you can restore the original red underlines if needed
      redUnderlines.forEach((span) => {
        span.style.textDecoration = "underline";  // Restore underline
        span.style.color = "red";  // Restore red color
      });

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {loading ? (
        <p className="text-center text-xl text-gray-700">Loading resume...</p>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Resume</h2>
          
          <div className="flex justify-center mb-6">
            <input
              type="file"
              onChange={handleFileChange}
              className="p-3 border rounded-lg bg-white shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Editor
            apiKey="n7igyli7typhj3datc05fv28dnj859hzav54ewi6plp2iih6"
            value={resumeContent}
            onEditorChange={(content) => setResumeContent(content)}
            init={{
              plugins: [
                "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media", "searchreplace", "table", "visualblocks", "wordcount",
                "checklist", "mediaembed", "casechange", "export", "formatpainter", "pageembed", "a11ychecker", "permanentpen", "powerpaste", "advtable", "advcode", "editimage", "advtemplate", "ai", "mentions", "tinycomments", "tableofcontents", "footnotes", "mergetags", "autocorrect", "typography", "inlinecss", "markdown", "importword", "exportword", "exportpdf","importpdf", 'autoresize', "save"
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat" | "save",
              paste_word_valid_elements: "strong,em,u,a,ul,ol,li,p,h1,h2,h3,h4,h5,h6,table,tr,th,td,br",
              paste_word_import_styles: true, // Import styles from Word
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
            }}
            className="bg-white rounded-lg shadow-lg p-4"
          />

          <div className="flex justify-center mt-8">
            <button
              onClick={generateUpdatedPdf}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              Save and Generate PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewResume;
