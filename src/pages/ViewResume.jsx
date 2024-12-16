import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react"; 
import mammoth from "mammoth"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";



const ViewResume = () => {
  const { id } = useParams(); 
  const [resumeContent, setResumeContent] = useState(""); 
  const [resumeURL, setResumeURL] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();

  
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

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then((result) => {
            setResumeContent(result.value); 
          })
          .catch((error) => {
            console.error("Error converting Word document:", error);
          });
      };
      reader.readAsArrayBuffer(file);
    }

  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  
  //   if (file) {
  //     // Handle Word Documents (.docx)
  //     if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const arrayBuffer = e.target.result;
  //         mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
  //           .then((result) => {
  //             setResumeContent(result.value); // Set converted Word document content
  //           })
  //           .catch((error) => {
  //             console.error("Error converting Word document:", error);
  //           });
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } 
  //     // Handle PDF Files
  //     if (file) {
  //       // Handle PDF Files
  //       if (file.type === "application/pdf") {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           const typedArray = new Uint8Array(e.target.result);
    
  //           const options = {
  //             type: 'text',  // 'text' or 'html'
  //           };
    
  //           const processor = pdfExtract(typedArray, options, (err, data) => {
  //             if (err) {
  //               console.error("Error extracting text from PDF:", err);
  //               return;
  //             }
    
  //             // data.text will have the extracted text
  //             setResumeContent(data.text);  // Set the extracted text
  //           });
  //         };
  //         reader.readAsArrayBuffer(file);
  //       }
  //     }
  //     else {
  //       console.error("Unsupported file format. Please upload a .docx or .pdf file.");
  //     }
  //   }
  // };



// const handleFileChange = (event) => {
//   const file = event.target.files[0];

//   if (file) {
//     const reader = new FileReader();

//     if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//       // Handle DOCX files
//       reader.onload = (e) => {
//         const arrayBuffer = e.target.result;
//         mammoth
//           .convertToHtml({ arrayBuffer: arrayBuffer })
//           .then((result) => {
//             setResumeContent(result.value);
//           })
//           .catch((error) => {
//             console.error("Error converting Word document:", error);
//           });
//       };
//       reader.readAsArrayBuffer(file);
//     } else if (file.type === "application/pdf") {
//       // Handle PDF files
//       reader.onload = async (e) => {
//         try {
//           const arrayBuffer = e.target.result;

//           // Ensure PDF.js worker is configured
//           pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

//           const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//           let text = '';
//           for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//             const page = await pdf.getPage(pageNum);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items.map((item) => item.str).join(' ');
//             text += `<p>${pageText}</p>\n\n`; // Wrap text in paragraphs
//           }

//           setResumeContent(text); // Set PDF content as HTML
//         } catch (error) {
//           console.error("Error converting PDF:", error);
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     } else {
//       console.error("Unsupported file type");
//     }
//   }
// };

  
  const fetchResumeContent = async () => {
    try {
      const response = await fetch(resumeURL);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      //console.log(pdfDoc)
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


  // const fetchResumeContent = async () => {
  //   try {
  //     // Set the worker source for pdf.js
  //     pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  //     const response = await fetch(resumeURL);
  //     const arrayBuffer = await response.arrayBuffer();
  //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
  //     let text = '';
  //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const textContent = await page.getTextContent();
  //       const pageText = textContent.items.map(item => item.str).join(' ');
  //       text += pageText + '\n\n';
  //     }
      
  //     setResumeContent(text);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching or parsing PDF:", error);
  //     setLoading(false);
  //   }
  // };
  

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

  
  const generateUpdatedPdf = async () => {
    try {
      
      const editorContent = document.querySelector(".tox-edit-area iframe").contentDocument.body;

      
      const redUnderlines = editorContent.querySelectorAll("span[style*='color: red;'][style*='text-decoration: underline;']");
      redUnderlines.forEach((span) => {
        
        span.style.textDecoration = "none"; 
        span.style.color = "black"; 
      });

      
      const canvas = await html2canvas(editorContent, { scale: 2 });
      const imageData = canvas.toDataURL("image/png");

      
      const pdfWidth = 530;  
      const leftMargin = 25; 
      const rightMargin = 25; 

      
      const contentHeight = canvas.height * (pdfWidth / canvas.width);  
      const pdfHeight = contentHeight < 500 ? 500 : contentHeight; 

      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight], 
      });

      
      const scaledWidth = pdfWidth - leftMargin - rightMargin;  
      const scale = scaledWidth / canvas.width;  
      const scaledHeight = canvas.height * scale; 

      
      pdf.addImage(imageData, "PNG", leftMargin, 0, scaledWidth, scaledHeight);

      
      pdf.save(`${name}_resume.pdf`);

      
      redUnderlines.forEach((span) => {
        span.style.textDecoration = "underline";  
        span.style.color = "red";  
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
              paste_word_import_styles: true, 
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
