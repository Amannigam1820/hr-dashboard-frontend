import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist";

// Point to the locally hosted worker file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PdfToHtmlConverter = () => {
  const [htmlContent, setHtmlContent] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        let extractedHtml = "";

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          console.log(page);

          const textContent = await page.getTextContent();

          // Debugging: Check what the textContent.items contains
          console.log(`Text content of page ${i}:`, textContent.items);

          const scale = 1.5; // Adjust the scale as needed

          const pageHtml = textContent.items
            .map((item) => {
              const { str, transform, fontSize, width, height } = item;
              // Invert the Y-axis (the second value in transform) to align with the browser's coordinate system
              const invertedTop = page.view[3] - transform[5]; // page.view[3] gives the page height in PDF coordinates

              const style = `
                font-size:${fontSize || 12}px; 
                transform: translate(${transform[4] * scale}px, ${invertedTop * scale}px);
                white-space: pre-wrap; word-wrap: break-word;
                position: absolute; 
                left: ${transform[4] * scale}px; 
                top: ${invertedTop * scale}px; 
                width: ${width * scale}px;
                height: ${height * scale}px;
              `;

              return `<span style="${style}">${str}</span>`;
            })
            .join("");

          // Add the page HTML to the result with a wrapper
          extractedHtml += `
            <div style="position:relative; margin-bottom: 20px; page-break-before: always; height: auto; width: 100%; border: 1px solid #ddd;">
              <h3 style="text-align:center; font-size: 1.5em;">Page ${i}</h3>
              ${pageHtml}
            </div>
          `;
        }

        // Set the HTML content for rendering
        setHtmlContent(extractedHtml);

      } catch (error) {
        console.error("Error extracting content from PDF:", error);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div 
        style={{ 
          position: "relative", 
          overflowY: "auto",  // Scrollable content
          height: "800px",  // Adjust the height for the content container
          border: "1px solid #ccc",  // Optional border for the container
          padding: "10px"  // Optional padding for better spacing
        }} 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
};

export default PdfToHtmlConverter;
