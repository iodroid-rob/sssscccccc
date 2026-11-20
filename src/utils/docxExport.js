import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx';
import { saveAs } from 'file-saver';

export async function exportPaperToDocx({ paperInfo, questions, isAnswerBooklet, includeAnswerKey = false }) {
  const children = [];

  // Top School Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (paperInfo.schoolName || 'ACADEMIC INSTITUTION').toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: paperInfo.examName || 'EXAMINATION',
          bold: true,
          size: 26, // 13pt
          font: 'Times New Roman'
        }),
        new TextRun({
          text: paperInfo.session ? ` (${paperInfo.session})` : '',
          bold: true,
          size: 24,
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Subheader details table: Class, Set, Max Marks, Time
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '333333' },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Class: ', bold: true }),
                  new TextRun({ text: paperInfo.classLevel || 'Class 10' })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Set: ', bold: true }),
                  new TextRun({ text: paperInfo.set || 'A' })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Time: ', bold: true }),
                  new TextRun({ text: paperInfo.timeAllowed || '3 Hours' })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Max. Marks: ', bold: true }),
                  new TextRun({ text: `${paperInfo.maxMarks || 80}` })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
  children.push(metaTable);

  // Mode Notice if Answer Booklet
  if (isAnswerBooklet) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: '[ QUESTION PAPER-CUM-ANSWER BOOKLET ]',
            bold: true,
            size: 20,
            italics: true,
            color: '444444'
          })
        ]
      })
    );
  }

  // General Instructions
  children.push(
    new Paragraph({
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({
          text: 'General Instructions:',
          bold: true,
          size: 22,
          underline: {}
        })
      ]
    })
  );

  const instructions = (paperInfo.instructions || '').split('\n').filter(Boolean);
  const defaultInstructions = [
    '1. Read all the questions carefully before attempting.',
    '2. All questions are compulsory unless internal choice is provided.',
    isAnswerBooklet 
      ? '3. Write your answers strictly in the spaces provided below each question.'
      : '3. Answers should be brief and to the point according to the marks allotted.',
    '4. Marks for each question are indicated against it.'
  ];
  const finalInstructions = instructions.length > 0 ? instructions : defaultInstructions;

  finalInstructions.forEach((inst) => {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: inst.trim(), size: 20 })
        ]
      })
    );
  });

  // Divider line
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 200 },
      border: {
        bottom: { color: '444444', size: 6, style: BorderStyle.SINGLE }
      }
    })
  );

  // Group questions by type or list sequentially
  const typeTitles = {
    mcq: 'Multiple Choice Questions (1 Mark Each)',
    fillups: 'Fill in the Blanks (1 Mark Each)',
    true_false: 'True or False (1 Mark Each)',
    matching: 'Match the Following',
    vsa: 'Very Short Answer Questions (2 Marks Each)',
    sa: 'Short Answer Questions (3 Marks Each)',
    la: 'Long Answer Questions (5 Marks Each)'
  };

  // Grouping
  const typeOrder = ['mcq', 'fillups', 'true_false', 'matching', 'vsa', 'sa', 'la'];
  let qNumber = 1;

  typeOrder.forEach((t) => {
    const list = questions.filter((q) => q.type === t);
    if (list.length === 0) return;

    // Section Header
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: `SECTION - ${typeTitles[t] || t.toUpperCase()}`,
            bold: true,
            size: 22,
            color: '1a365d'
          })
        ]
      })
    );

    list.forEach((q) => {
      const qNumText = `Q${qNumber}. `;
      const marksText = ` [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`;

      // Question paragraph with marks right aligned or inline
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: qNumText, bold: true, size: 21 }),
            new TextRun({ text: q.text, size: 21 }),
            new TextRun({ text: marksText, bold: true, italics: true, size: 20 })
          ]
        })
      );

      // Options for MCQ
      if (q.type === 'mcq' && q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          children.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({ text: opt, size: 20 })
              ]
            })
          );
        });
      }

      // Match pairs for Matching questions
      if (q.type === 'matching' && q.matchPairs && q.matchPairs.length > 0) {
        q.matchPairs.forEach((pair) => {
          children.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `${pair.left.padEnd(30, ' ')} --------> ${pair.right}`, size: 20 })
              ]
            })
          );
        });
      }

      // Answer Booklet Space if enabled!
      if (isAnswerBooklet) {
        const lineCount = q.answerLinesCount || (q.type === 'la' ? 10 : q.type === 'sa' ? 6 : q.type === 'vsa' ? 3 : 1);
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({ text: 'Answer:', bold: true, italics: true, size: 19, color: '666666' })
            ]
          })
        );

        for (let i = 0; i < lineCount; i++) {
          children.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: '_________________________________________________________________________________',
                  color: '999999'
                })
              ]
            })
          );
        }
      }

      qNumber++;
    });
  });

  // End of paper
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 200 },
      children: [
        new TextRun({ text: '--- *** END OF QUESTION PAPER *** ---', bold: true, size: 20 })
      ]
    })
  );

  // Optional Answer Key at the end
  if (includeAnswerKey) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 150 },
        children: [
          new TextRun({
            text: 'TEACHER ANSWER KEY & MARKING SCHEME',
            bold: true,
            size: 26,
            underline: {}
          })
        ]
      })
    );

    let ansIndex = 1;
    typeOrder.forEach((t) => {
      const list = questions.filter((q) => q.type === t);
      if (list.length === 0) return;

      list.forEach((q) => {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({ text: `Ans ${ansIndex} (${q.type.toUpperCase()} - ${q.marks}M): `, bold: true, size: 20 }),
              new TextRun({ text: q.answer || 'Refer to text / standard solution.', size: 20, color: '1e3a8a' })
            ]
          })
        );
        ansIndex++;
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${(paperInfo.examName || 'Question_Paper').replace(/[^a-zA-Z0-9_-]/g, '_')}_${paperInfo.classLevel || 'Class'}_Set_${paperInfo.set || 'A'}.docx`;
  saveAs(blob, fileName);
}
