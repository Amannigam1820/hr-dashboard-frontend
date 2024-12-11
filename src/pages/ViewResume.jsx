import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useParams } from "react-router-dom";

const ViewResume = () => {
  const { id } = useParams();
  const [resumeURL, setResumeURL] = useState("");
  const [editableContent, setEditableContent] = useState({
    skills: "",
    experience: "",
  });

  // Fetch resume URL
  useEffect(() => {
    const fetchResumeURL = async () => {
      const response = await fetch(`http://127.0.0.1:8080/api/employee/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setResumeURL(data.hr.resume);

      // Load the PDF and extract text (simplified)
      const pdfBytes = await fetch(data.hr.resume).then((res) =>
        res.arrayBuffer()
      );
      await loadPDF(pdfBytes);
    };

    fetchResumeURL();
  }, [id]);

  // Load the PDF and set placeholders for editable sections
  const loadPDF = async (pdfBytes) => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]; // Assuming text is on the first page

    // Simulate predefined editable sections
    setEditableContent({
      skills: "React, Node.js, SQL", // Replace with parsed content if required
      experience: "2 years in full-stack development",
    });
  };

  // Handle content updates
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setEditableContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update PDF with edited content (clear and redraw the section)
  const updatePDF = async () => {
    const pdfBytes = await fetch(resumeURL).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { skills, experience } = editableContent;

    // Clear and redraw Skills
    firstPage.drawRectangle({
      x: 50,
      y: 690,
      width: 500,
      height: 20,
      color: rgb(1, 1, 1), // Clear the previous text by drawing a black rectangle
    });
    firstPage.drawText(`Skills: ${skills}`, {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0, 0, 0), // Write new text
    });

    // Clear and redraw Experience
    firstPage.drawRectangle({
      x: 50,
      y: 670,
      width: 500,
      height: 20,
      color: rgb(1, 1, 1), // Clear the previous text by drawing a black rectangle
    });
    firstPage.drawText(`Experience: ${experience}`, {
      x: 50,
      y: 680,
      size: 12,
      font,
      color: rgb(0, 0, 0), // Write new text
    });

    const updatedPdfBytes = await pdfDoc.save();
    const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
    const updatedPdfURL = URL.createObjectURL(blob);

    setResumeURL(updatedPdfURL); // Update iframe to show edited PDF
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
  {/* Editable fields */}
  <div style={{ marginBottom: "20px" }}>
    <label
      htmlFor="skills"
      style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
    >
      Skills:
    </label>
    <textarea
      name="skills"
      value={editableContent.skills}
      onChange={handleContentChange}
      rows={2}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
        marginBottom: "15px",
        resize: "vertical",
      }}
    />
    <label
      htmlFor="experience"
      style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
    >
      Experience:
    </label>
    <textarea
      name="experience"
      value={editableContent.experience}
      onChange={handleContentChange}
      rows={2}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
        marginBottom: "20px",
        resize: "vertical",
      }}
    />
  </div>

  {/* Button to update PDF */}
  <button
    onClick={updatePDF}
    style={{
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
  >
    Update Resume
  </button>

  {/* Display the PDF */}
  <div
    style={{
      marginTop: "20px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      padding: "10px",
    }}
  >
    <iframe
      src={resumeURL}
      width="100%"
      height="600px"
      title="Resume"
      style={{ border: "none", borderRadius: "5px" }}
    />
  </div>
</div>

  );
};

export default ViewResume;


// import React, { useEffect, useState } from "react";
// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import { useParams } from "react-router-dom";

// const ViewResume = () => {
//   const { id } = useParams();
//   const [resumeURL, setResumeURL] = useState("");
//   const [editableContent, setEditableContent] = useState({
//     skills: "",
//     experience: "",
//   });

//   // Fetch resume URL
//   useEffect(() => {
//     const fetchResumeURL = async () => {
//       const response = await fetch(`http://127.0.0.1:8080/api/employee/${id}`, {
//         method: "GET",
//         credentials: "include",
//       });
//       const data = await response.json();
//       setResumeURL(data.hr.resume);

//       // Load the PDF and extract text (simplified)
//       const pdfBytes = await fetch(data.hr.resume).then((res) =>
//         res.arrayBuffer()
//       );
//       await loadPDF(pdfBytes);
//     };

//     fetchResumeURL();
//   }, [id]);

//   // Load the PDF and set placeholders for editable sections
//   const loadPDF = async (pdfBytes) => {
//     const pdfDoc = await PDFDocument.load(pdfBytes);
//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0]; // Assuming text is on the first page

//     // Simulate predefined editable sections
//     setEditableContent({
//       skills: "React, Node.js, SQL", // Replace with parsed content if required
//       experience: "2 years in full-stack development",
//     });
//   };

//   // Handle content updates
//   const handleContentChange = (e) => {
//     const { name, value } = e.target;
//     setEditableContent((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Update PDF with edited content (clear and redraw the section)
//   const updatePDF = async () => {
//     const pdfBytes = await fetch(resumeURL).then((res) => res.arrayBuffer());
//     const pdfDoc = await PDFDocument.load(pdfBytes);

//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];

//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const { skills, experience } = editableContent;

//     // Clear and redraw Skills
//     firstPage.drawRectangle({
//       x: 50,
//       y: 690,
//       width: 500,
//       height: 20,
//       color: rgb(1, 1, 1), // Clear the previous text by drawing a black rectangle
//     });
//     firstPage.drawText(`Skills: ${skills}`, {
//       x: 50,
//       y: 700,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0), // Write new text
//     });

//     // Clear and redraw Experience
//     firstPage.drawRectangle({
//       x: 50,
//       y: 670,
//       width: 500,
//       height: 20,
//       color: rgb(1, 1, 1), // Clear the previous text by drawing a black rectangle
//     });
//     firstPage.drawText(`Experience: ${experience}`, {
//       x: 50,
//       y: 680,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0), // Write new text
//     });

//     const updatedPdfBytes = await pdfDoc.save();
//     const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
//     const updatedPdfURL = URL.createObjectURL(blob);

//     setResumeURL(updatedPdfURL); // Update iframe to show edited PDF
//   };

//   // Open in PDFescape editor
//   const openInSmallpdf = () => {
//     const smallpdfURL = `https://smallpdf.com/edit-pdf?url=${encodeURIComponent(resumeURL)}`;
//     window.open(smallpdfURL, "_blank");
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "100%", margin: "0 auto", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
//     {/* Editable fields */}
//     <div style={{ marginBottom: "20px" }}>
//       {/* <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
//         Skills:
//         <textarea
//           name="skills"
//           value={editableContent.skills}
//           onChange={handleContentChange}
//           rows={2}
//           style={{
//             width: "100%",
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ddd",
//             boxSizing: "border-box",
//             marginBottom: "10px",
//             fontSize: "14px",
//             backgroundColor: "#fff",
//             resize: "vertical"
//           }}
//         />
//       </label> */}
//       {/* <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
//         Experience:
//         <textarea
//           name="experience"
//           value={editableContent.experience}
//           onChange={handleContentChange}
//           rows={2}
//           style={{
//             width: "100%",
//             padding: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ddd",
//             boxSizing: "border-box",
//             marginBottom: "10px",
//             fontSize: "14px",
//             backgroundColor: "#fff",
//             resize: "vertical"
//           }}
//         />
//       </label> */}
//     </div>
  
//     {/* Buttons */}
//     <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
//       {/* <button
//         onClick={updatePDF}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#4CAF50",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           fontSize: "16px",
//           cursor: "pointer",
//           transition: "background-color 0.3s ease"
//         }}
//         onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
//         onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
//       >
//         Update Resume
//       </button> */}
//       <button
//         onClick={openInSmallpdf}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#007BFF",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           fontSize: "16px",
//           cursor: "pointer",
//           transition: "background-color 0.3s ease"
//         }}
//         onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
//         onMouseOut={(e) => e.target.style.backgroundColor = "#007BFF"}
//       >
//         Open in PDF Editor
//       </button>
//     </div>
  
//     {/* Display the PDF */}
//     <iframe src={resumeURL} width="100%" height="600px" title="Resume" />
//   </div>
  
//   );
// };

// export default ViewResume;
