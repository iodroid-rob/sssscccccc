// Pre-populated curriculum books, chapters, and question bank for teachers across classes

export const SAMPLE_LOGOS = [
  {
    id: 'crest-shield',
    name: 'Academic Shield',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'crest-torch',
    name: 'Wisdom Torch',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'crest-book',
    name: 'Open Book Emblem',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=160&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'crest-globe',
    name: 'Global Academy',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=160&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

export const INITIAL_BOOKS = [
  // ==========================================
  // CLASS 12 CURRICULUM
  // ==========================================
  {
    id: 'book-phy-12',
    title: 'NCERT Physics Part I & II',
    subject: 'Physics',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-phy12-1', title: 'Chapter 1: Electric Charges and Fields' },
      { id: 'ch-phy12-2', title: 'Chapter 2: Electrostatic Potential and Capacitance' },
      { id: 'ch-phy12-3', title: 'Chapter 3: Current Electricity' },
      { id: 'ch-phy12-4', title: 'Chapter 4: Moving Charges and Magnetism' },
      { id: 'ch-phy12-5', title: 'Chapter 5: Magnetism and Matter' },
      { id: 'ch-phy12-6', title: 'Chapter 6: Electromagnetic Induction & AC' },
      { id: 'ch-phy12-7', title: 'Chapter 7: Ray Optics and Optical Instruments' },
      { id: 'ch-phy12-8', title: 'Chapter 8: Wave Optics' },
      { id: 'ch-phy12-9', title: 'Chapter 9: Dual Nature of Radiation & Atoms' },
      { id: 'ch-phy12-10', title: 'Chapter 10: Semiconductor Electronics' }
    ]
  },
  {
    id: 'book-chem-12',
    title: 'NCERT Chemistry Part I & II',
    subject: 'Chemistry',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-chem12-1', title: 'Chapter 1: Solutions & Colligative Properties' },
      { id: 'ch-chem12-2', title: 'Chapter 2: Electrochemistry & Nernst Equation' },
      { id: 'ch-chem12-3', title: 'Chapter 3: Chemical Kinetics & Rate Laws' },
      { id: 'ch-chem12-4', title: 'Chapter 4: d and f Block Elements' },
      { id: 'ch-chem12-5', title: 'Chapter 5: Coordination Compounds & Isomerism' },
      { id: 'ch-chem12-6', title: 'Chapter 6: Haloalkanes and Haloarenes' },
      { id: 'ch-chem12-7', title: 'Chapter 7: Alcohols, Phenols and Ethers' },
      { id: 'ch-chem12-8', title: 'Chapter 8: Aldehydes, Ketones and Carboxylic Acids' },
      { id: 'ch-chem12-9', title: 'Chapter 9: Amines & Organic Compounds containing Nitrogen' },
      { id: 'ch-chem12-10', title: 'Chapter 10: Biomolecules (Carbohydrates, Proteins, Nucleic Acids)' }
    ]
  },
  {
    id: 'book-math-12',
    title: 'NCERT Mathematics Part I & II',
    subject: 'Mathematics',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-math12-1', title: 'Chapter 1: Relations and Functions' },
      { id: 'ch-math12-2', title: 'Chapter 2: Inverse Trigonometric Functions' },
      { id: 'ch-math12-3', title: 'Chapter 3: Matrices and Determinants' },
      { id: 'ch-math12-4', title: 'Chapter 4: Continuity and Differentiability' },
      { id: 'ch-math12-5', title: 'Chapter 5: Applications of Derivatives (AOD)' },
      { id: 'ch-math12-6', title: 'Chapter 6: Integrals (Definite & Indefinite)' },
      { id: 'ch-math12-7', title: 'Chapter 7: Differential Equations' },
      { id: 'ch-math12-8', title: 'Chapter 8: Vector Algebra & 3-Dimensional Geometry' },
      { id: 'ch-math12-9', title: 'Chapter 9: Linear Programming Problem (LPP)' },
      { id: 'ch-math12-10', title: 'Chapter 10: Probability & Bayes Theorem' }
    ]
  },
  {
    id: 'book-bio-12',
    title: 'NCERT Biology Core',
    subject: 'Biology',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-bio12-1', title: 'Chapter 1: Sexual Reproduction in Flowering Plants' },
      { id: 'ch-bio12-2', title: 'Chapter 2: Human Reproduction & Reproductive Health' },
      { id: 'ch-bio12-3', title: 'Chapter 3: Principles of Inheritance and Variation' },
      { id: 'ch-bio12-4', title: 'Chapter 4: Molecular Basis of Inheritance' },
      { id: 'ch-bio12-5', title: 'Chapter 5: Human Health and Disease' },
      { id: 'ch-bio12-6', title: 'Chapter 6: Biotechnology: Principles and Processes' },
      { id: 'ch-bio12-7', title: 'Chapter 7: Organisms and Populations' },
      { id: 'ch-bio12-8', title: 'Chapter 8: Ecosystem and Biodiversity Conservation' }
    ]
  },
  {
    id: 'book-cs-12',
    title: 'Computer Science with Python & SQL',
    subject: 'Computer Science',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-cs12-1', title: 'Chapter 1: Computational Thinking and Python Revision' },
      { id: 'ch-cs12-2', title: 'Chapter 2: Functions, Exception Handling & File Handling (Text/CSV/Binary)' },
      { id: 'ch-cs12-3', title: 'Chapter 3: Data Structures (Linear Stacks using Lists)' },
      { id: 'ch-cs12-4', title: 'Chapter 4: Computer Networks, Protocols & Web Services' },
      { id: 'ch-cs12-5', title: 'Chapter 5: Database Concepts & Structured Query Language (SQL)' },
      { id: 'ch-cs12-6', title: 'Chapter 6: Python-SQL Database Connectivity' }
    ]
  },
  {
    id: 'book-eng-12',
    title: 'Flamingo & Vistas: English Core',
    subject: 'English',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-eng12-1', title: 'Chapter 1: The Last Lesson (Prose)' },
      { id: 'ch-eng12-2', title: 'Chapter 2: Lost Spring & Deep Water' },
      { id: 'ch-eng12-3', title: 'Chapter 3: The Rattrap & Indigo' },
      { id: 'ch-eng12-4', title: 'Chapter 4: My Mother at Sixty-Six & Keeping Quiet (Poetry)' },
      { id: 'ch-eng12-5', title: 'Chapter 5: A Thing of Beauty & Aunt Jennifer’s Tigers' },
      { id: 'ch-eng12-6', title: 'Chapter 6: The Third Level & The Tiger King (Vistas)' },
      { id: 'ch-eng12-7', title: 'Chapter 7: Advanced Writing Skills: Notice, Letter & Article' }
    ]
  },
  {
    id: 'book-comm-12',
    title: 'Accountancy, Business Studies & Macroeconomics',
    subject: 'Commerce & Economics',
    classLevel: 'Class 12',
    chapters: [
      { id: 'ch-comm12-1', title: 'Chapter 1: Accounting for Partnership Firms' },
      { id: 'ch-comm12-2', title: 'Chapter 2: Accounting for Share Capital & Debentures' },
      { id: 'ch-comm12-3', title: 'Chapter 3: Principles and Functions of Management' },
      { id: 'ch-comm12-4', title: 'Chapter 4: Financial Management & Marketing Management' },
      { id: 'ch-comm12-5', title: 'Chapter 5: National Income and Related Aggregates' },
      { id: 'ch-comm12-6', title: 'Chapter 6: Money and Banking & Government Budget' }
    ]
  },

  // ==========================================
  // CLASS 11 CURRICULUM
  // ==========================================
  {
    id: 'book-phy-11',
    title: 'NCERT Physics Class 11',
    subject: 'Physics',
    classLevel: 'Class 11',
    chapters: [
      { id: 'ch-phy11-1', title: 'Chapter 1: Units and Measurements' },
      { id: 'ch-phy11-2', title: 'Chapter 2: Motion in a Straight Line & Plane' },
      { id: 'ch-phy11-3', title: 'Chapter 3: Laws of Motion & Friction' },
      { id: 'ch-phy11-4', title: 'Chapter 4: Work, Energy and Power' },
      { id: 'ch-phy11-5', title: 'Chapter 5: System of Particles and Rotational Motion' },
      { id: 'ch-phy11-6', title: 'Chapter 6: Gravitation' },
      { id: 'ch-phy11-7', title: 'Chapter 7: Mechanical Properties of Solids and Fluids' },
      { id: 'ch-phy11-8', title: 'Chapter 8: Thermodynamics & Kinetic Theory' },
      { id: 'ch-phy11-9', title: 'Chapter 9: Oscillations and Waves' }
    ]
  },
  {
    id: 'book-chem-11',
    title: 'NCERT Chemistry Class 11',
    subject: 'Chemistry',
    classLevel: 'Class 11',
    chapters: [
      { id: 'ch-chem11-1', title: 'Chapter 1: Some Basic Concepts of Chemistry' },
      { id: 'ch-chem11-2', title: 'Chapter 2: Structure of Atom & Quantum Model' },
      { id: 'ch-chem11-3', title: 'Chapter 3: Classification of Elements & Periodicity' },
      { id: 'ch-chem11-4', title: 'Chapter 4: Chemical Bonding and Molecular Structure' },
      { id: 'ch-chem11-5', title: 'Chapter 5: Chemical Thermodynamics' },
      { id: 'ch-chem11-6', title: 'Chapter 6: Equilibrium (Ionic & Chemical)' },
      { id: 'ch-chem11-7', title: 'Chapter 7: Redox Reactions' },
      { id: 'ch-chem11-8', title: 'Chapter 8: Organic Chemistry: Basic Principles & Hydrocarbons' }
    ]
  },
  {
    id: 'book-math-11',
    title: 'NCERT Mathematics Class 11',
    subject: 'Mathematics',
    classLevel: 'Class 11',
    chapters: [
      { id: 'ch-math11-1', title: 'Chapter 1: Sets, Relations and Functions' },
      { id: 'ch-math11-2', title: 'Chapter 2: Trigonometric Functions' },
      { id: 'ch-math11-3', title: 'Chapter 3: Complex Numbers and Quadratic Equations' },
      { id: 'ch-math11-4', title: 'Chapter 4: Linear Inequalities' },
      { id: 'ch-math11-5', title: 'Chapter 5: Permutations and Combinations & Binomial Theorem' },
      { id: 'ch-math11-6', title: 'Chapter 6: Sequences and Series (AP & GP)' },
      { id: 'ch-math11-7', title: 'Chapter 7: Straight Lines & Conic Sections' },
      { id: 'ch-math11-8', title: 'Chapter 8: Limits and Derivatives' },
      { id: 'ch-math11-9', title: 'Chapter 9: Statistics and Probability' }
    ]
  },
  {
    id: 'book-eng-11',
    title: 'Hornbill & Snapshots: English Class 11',
    subject: 'English',
    classLevel: 'Class 11',
    chapters: [
      { id: 'ch-eng11-1', title: 'Chapter 1: The Portrait of a Lady' },
      { id: 'ch-eng11-2', title: 'Chapter 2: We\'re Not Afraid to Die... If We Can All Be Together' },
      { id: 'ch-eng11-3', title: 'Chapter 3: Discovering Tut: The Saga Continues' },
      { id: 'ch-eng11-4', title: 'Chapter 4: A Photograph & The Laburnum Top (Poetry)' },
      { id: 'ch-eng11-5', title: 'Chapter 5: The Summer of the Beautiful White Horse' },
      { id: 'ch-eng11-6', title: 'Chapter 6: Formal Letters, Note Making & Grammar' }
    ]
  },

  // ==========================================
  // CLASS 10 CURRICULUM
  // ==========================================
  {
    id: 'book-sci-10',
    title: 'NCERT Science & Technology',
    subject: 'Science',
    classLevel: 'Class 10',
    chapters: [
      { id: 'ch-sci-1', title: 'Chapter 1: Chemical Reactions and Equations' },
      { id: 'ch-sci-2', title: 'Chapter 2: Acids, Bases and Salts' },
      { id: 'ch-sci-3', title: 'Chapter 3: Metals and Non-metals' },
      { id: 'ch-sci-4', title: 'Chapter 4: Life Processes' },
      { id: 'ch-sci-5', title: 'Chapter 5: Control and Coordination' },
      { id: 'ch-sci-6', title: 'Chapter 6: Light - Reflection and Refraction' },
      { id: 'ch-sci-7', title: 'Chapter 7: Electricity & Magnetic Effects' },
      { id: 'ch-sci-8', title: 'Chapter 8: Our Environment' },
    ]
  },
  {
    id: 'book-math-10',
    title: 'Mathematics Exemplar & Core',
    subject: 'Mathematics',
    classLevel: 'Class 10',
    chapters: [
      { id: 'ch-math-1', title: 'Chapter 1: Real Numbers' },
      { id: 'ch-math-2', title: 'Chapter 2: Polynomials' },
      { id: 'ch-math-3', title: 'Chapter 3: Pair of Linear Equations in Two Variables' },
      { id: 'ch-math-4', title: 'Chapter 4: Quadratic Equations' },
      { id: 'ch-math-5', title: 'Chapter 5: Arithmetic Progressions' },
      { id: 'ch-math-6', title: 'Chapter 6: Triangles & Coordinate Geometry' },
      { id: 'ch-math-7', title: 'Chapter 7: Introduction to Trigonometry' },
      { id: 'ch-math-8', title: 'Chapter 8: Statistics and Probability' },
    ]
  },
  {
    id: 'book-eng-10',
    title: 'First Flight: English Language & Literature',
    subject: 'English',
    classLevel: 'Class 10',
    chapters: [
      { id: 'ch-eng-1', title: 'Chapter 1: A Letter to God' },
      { id: 'ch-eng-2', title: 'Chapter 2: Nelson Mandela: Long Walk to Freedom' },
      { id: 'ch-eng-3', title: 'Chapter 3: Two Stories about Flying' },
      { id: 'ch-eng-4', title: 'Chapter 4: From the Diary of Anne Frank' },
      { id: 'ch-eng-5', title: 'Chapter 5: Glimpses of India' },
      { id: 'ch-eng-6', title: 'Chapter 6: The Trees & Fog (Poetry)' },
      { id: 'ch-eng-7', title: 'Chapter 7: Grammar: Modals, Tenses & Reported Speech' }
    ]
  },
  {
    id: 'book-sst-10',
    title: 'Social Science: India and the Contemporary World',
    subject: 'Social Science',
    classLevel: 'Class 10',
    chapters: [
      { id: 'ch-sst-1', title: 'Chapter 1: The Rise of Nationalism in Europe' },
      { id: 'ch-sst-2', title: 'Chapter 2: Nationalism in India' },
      { id: 'ch-sst-3', title: 'Chapter 3: Resources and Development' },
      { id: 'ch-sst-4', title: 'Chapter 4: Agriculture & Mineral Resources' },
      { id: 'ch-sst-5', title: 'Chapter 5: Power Sharing & Federalism' },
      { id: 'ch-sst-6', title: 'Chapter 6: Money and Credit & Globalization' }
    ]
  },
  {
    id: 'book-cs-10',
    title: 'Computer Applications & Coding',
    subject: 'Computer Science',
    classLevel: 'Class 10',
    chapters: [
      { id: 'ch-cs-1', title: 'Chapter 1: Networking Basics & Internet Protocols' },
      { id: 'ch-cs-2', title: 'Chapter 2: HTML5, CSS and Web Designing' },
      { id: 'ch-cs-3', title: 'Chapter 3: Cyber Ethics, Security & Digital Footprints' },
      { id: 'ch-cs-4', title: 'Chapter 4: Python Basics & Algorithms' }
    ]
  },

  // ==========================================
  // CLASS 9 CURRICULUM
  // ==========================================
  {
    id: 'book-sci-9',
    title: 'NCERT Science Class 9',
    subject: 'Science',
    classLevel: 'Class 9',
    chapters: [
      { id: 'ch-sci9-1', title: 'Chapter 1: Matter in Our Surroundings' },
      { id: 'ch-sci9-2', title: 'Chapter 2: Is Matter Around Us Pure?' },
      { id: 'ch-sci9-3', title: 'Chapter 3: Atoms and Molecules' },
      { id: 'ch-sci9-4', title: 'Chapter 4: Structure of the Atom' },
      { id: 'ch-sci9-5', title: 'Chapter 5: The Fundamental Unit of Life (Cell)' },
      { id: 'ch-sci9-6', title: 'Chapter 6: Tissues (Plant & Animal)' },
      { id: 'ch-sci9-7', title: 'Chapter 7: Motion & Laws of Motion' },
      { id: 'ch-sci9-8', title: 'Chapter 8: Gravitation and Floatation' },
      { id: 'ch-sci9-9', title: 'Chapter 9: Work, Energy and Sound' }
    ]
  },
  {
    id: 'book-math-9',
    title: 'NCERT Mathematics Class 9',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    chapters: [
      { id: 'ch-math9-1', title: 'Chapter 1: Number Systems' },
      { id: 'ch-math9-2', title: 'Chapter 2: Polynomials & Algebraic Identities' },
      { id: 'ch-math9-3', title: 'Chapter 3: Coordinate Geometry & Linear Equations' },
      { id: 'ch-math9-4', title: 'Chapter 4: Lines, Angles and Triangles' },
      { id: 'ch-math9-5', title: 'Chapter 5: Quadrilaterals and Circles' },
      { id: 'ch-math9-6', title: 'Chapter 6: Heron\'s Formula & Surface Areas and Volumes' },
      { id: 'ch-math9-7', title: 'Chapter 7: Statistics and Data Analysis' }
    ]
  },
  {
    id: 'book-eng-9',
    title: 'Beehive & Moments: English Class 9',
    subject: 'English',
    classLevel: 'Class 9',
    chapters: [
      { id: 'ch-eng9-1', title: 'Chapter 1: The Fun They Had' },
      { id: 'ch-eng9-2', title: 'Chapter 2: The Sound of Music' },
      { id: 'ch-eng9-3', title: 'Chapter 3: The Little Girl & A Truly Beautiful Mind' },
      { id: 'ch-eng9-4', title: 'Chapter 4: The Road Not Taken & Wind (Poetry)' },
      { id: 'ch-eng9-5', title: 'Chapter 5: The Lost Child & The Adventures of Toto' },
      { id: 'ch-eng9-6', title: 'Chapter 6: Descriptive Paragraphs & Diary Entry' }
    ]
  },
  {
    id: 'book-sst-9',
    title: 'Social Science: Contemporary India Class 9',
    subject: 'Social Science',
    classLevel: 'Class 9',
    chapters: [
      { id: 'ch-sst9-1', title: 'Chapter 1: The French Revolution' },
      { id: 'ch-sst9-2', title: 'Chapter 2: Socialism in Europe and the Russian Revolution' },
      { id: 'ch-sst9-3', title: 'Chapter 3: India - Size and Location & Physical Features' },
      { id: 'ch-sst9-4', title: 'Chapter 4: Drainage & Climate of India' },
      { id: 'ch-sst9-5', title: 'Chapter 5: What is Democracy? Why Democracy?' },
      { id: 'ch-sst9-6', title: 'Chapter 6: Electoral Politics & Working of Institutions' },
      { id: 'ch-sst9-7', title: 'Chapter 7: The Story of Village Palampur & People as Resource' }
    ]
  },

  // ==========================================
  // JUNIOR CLASSES (CLASS 6, 7, 8)
  // ==========================================
  {
    id: 'book-sci-8',
    title: 'General Science Class 8',
    subject: 'Science',
    classLevel: 'Class 8',
    chapters: [
      { id: 'ch-sci8-1', title: 'Chapter 1: Crop Production and Management' },
      { id: 'ch-sci8-2', title: 'Chapter 2: Microorganisms: Friend and Foe' },
      { id: 'ch-sci8-3', title: 'Chapter 3: Coal and Petroleum' },
      { id: 'ch-sci8-4', title: 'Chapter 4: Combustion and Flame' },
      { id: 'ch-sci8-5', title: 'Chapter 5: Conservation of Plants and Animals' },
      { id: 'ch-sci8-6', title: 'Chapter 6: Reproduction in Animals' },
      { id: 'ch-sci8-7', title: 'Chapter 7: Force, Pressure and Friction' },
      { id: 'ch-sci8-8', title: 'Chapter 8: Sound & Chemical Effects of Electric Current' },
      { id: 'ch-sci8-9', title: 'Chapter 9: Light and Vision' }
    ]
  },
  {
    id: 'book-math-8',
    title: 'Mathematics Class 8',
    subject: 'Mathematics',
    classLevel: 'Class 8',
    chapters: [
      { id: 'ch-math8-1', title: 'Chapter 1: Rational Numbers' },
      { id: 'ch-math8-2', title: 'Chapter 2: Linear Equations in One Variable' },
      { id: 'ch-math8-3', title: 'Chapter 3: Understanding Quadrilaterals' },
      { id: 'ch-math8-4', title: 'Chapter 4: Data Handling & Squares and Square Roots' },
      { id: 'ch-math8-5', title: 'Chapter 5: Cubes and Cube Roots & Comparing Quantities' },
      { id: 'ch-math8-6', title: 'Chapter 6: Algebraic Expressions and Identities' },
      { id: 'ch-math8-7', title: 'Chapter 7: Mensuration & Exponents and Powers' }
    ]
  }
];

// Helper to filter or generate books for any class level
export function getBooksForClass(classLevel, allBooks = INITIAL_BOOKS) {
  const matching = allBooks.filter((b) => b.classLevel === classLevel);
  if (matching.length > 0) {
    return matching;
  }

  // If class is 1-7 or not listed, generate dynamic subject books for that class
  return [
    {
      id: `book-gen-sci-${classLevel}`,
      title: `${classLevel} Science & Nature`,
      subject: 'Science',
      classLevel: classLevel,
      chapters: [
        { id: `ch-${classLevel}-sci-1`, title: 'Chapter 1: Matter and Materials' },
        { id: `ch-${classLevel}-sci-2`, title: 'Chapter 2: Living Organisms and Environment' },
        { id: `ch-${classLevel}-sci-3`, title: 'Chapter 3: Food and Nutrition' },
        { id: `ch-${classLevel}-sci-4`, title: 'Chapter 4: Light, Electricity and Magnetism' },
        { id: `ch-${classLevel}-sci-5`, title: 'Chapter 5: Natural Phenomena' }
      ]
    },
    {
      id: `book-gen-math-${classLevel}`,
      title: `${classLevel} Mathematics Core`,
      subject: 'Mathematics',
      classLevel: classLevel,
      chapters: [
        { id: `ch-${classLevel}-math-1`, title: 'Chapter 1: Number Systems and Arithmetic' },
        { id: `ch-${classLevel}-math-2`, title: 'Chapter 2: Fractions, Decimals and Percentages' },
        { id: `ch-${classLevel}-math-3`, title: 'Chapter 3: Basic Algebra and Equations' },
        { id: `ch-${classLevel}-math-4`, title: 'Chapter 4: Geometry, Angles and Shapes' },
        { id: `ch-${classLevel}-math-5`, title: 'Chapter 5: Perimeter, Area and Mensuration' }
      ]
    },
    {
      id: `book-gen-eng-${classLevel}`,
      title: `${classLevel} English Language & Grammar`,
      subject: 'English',
      classLevel: classLevel,
      chapters: [
        { id: `ch-${classLevel}-eng-1`, title: 'Chapter 1: Reading Comprehension & Passages' },
        { id: `ch-${classLevel}-eng-2`, title: 'Chapter 2: English Literature Stories & Poetry' },
        { id: `ch-${classLevel}-eng-3`, title: 'Chapter 3: Grammar: Parts of Speech, Tenses & Voice' },
        { id: `ch-${classLevel}-eng-4`, title: 'Chapter 4: Creative Writing: Paragraphs, Letters & Essays' }
      ]
    },
    {
      id: `book-gen-sst-${classLevel}`,
      title: `${classLevel} Social Studies & History`,
      subject: 'Social Science',
      classLevel: classLevel,
      chapters: [
        { id: `ch-${classLevel}-sst-1`, title: 'Chapter 1: History: Ancient and Medieval Periods' },
        { id: `ch-${classLevel}-sst-2`, title: 'Chapter 2: Geography: Earth, Continents and Oceans' },
        { id: `ch-${classLevel}-sst-3`, title: 'Chapter 3: Civics: Government, Citizens and Rights' }
      ]
    }
  ];
}

export const INITIAL_QUESTION_BANK = [
  // Class 12 Physics & Chemistry samples
  {
    id: 'q-phy12-1',
    bookId: 'book-phy-12',
    chapterId: 'ch-phy12-1',
    type: 'mcq',
    marks: 1,
    text: 'What is the electric flux through a Gaussian cube enclosing a single dipole of charges +q and -q?',
    options: ['A) q / ε₀', 'B) 2q / ε₀', 'C) Zero', 'D) q / (2ε₀)'],
    answer: 'C) Zero (Net enclosed charge is zero)',
    answerLinesCount: 1
  },
  {
    id: 'q-chem12-1',
    bookId: 'book-chem-12',
    chapterId: 'ch-chem12-3',
    type: 'mcq',
    marks: 1,
    text: 'What are the units of rate constant for a second-order chemical reaction?',
    options: ['A) s⁻¹', 'B) mol L⁻¹ s⁻¹', 'C) L mol⁻¹ s⁻¹', 'D) L² mol⁻² s⁻¹'],
    answer: 'C) L mol⁻¹ s⁻¹',
    answerLinesCount: 1
  },
  {
    id: 'q-math12-1',
    bookId: 'book-math-12',
    chapterId: 'ch-math12-3',
    type: 'mcq',
    marks: 1,
    text: 'If A is a square matrix of order 3 and |A| = 5, then what is the value of |adj A|?',
    options: ['A) 5', 'B) 25', 'C) 125', 'D) 1/5'],
    answer: 'B) 25 (|adj A| = |A|^(n-1) = 5^(3-1) = 25)',
    answerLinesCount: 1
  },
  {
    id: 'q-phy12-2',
    bookId: 'book-phy-12',
    chapterId: 'ch-phy12-7',
    type: 'sa',
    marks: 3,
    text: 'State Huygens\' principle of wave optics. Use it to prove Snell\'s law of refraction of light.',
    answer: 'Every point on a primary wavefront acts as a secondary source. v1/v2 = sin i / sin r = constant n.',
    answerLinesCount: 6
  },
  {
    id: 'q-chem12-2',
    bookId: 'book-chem-12',
    chapterId: 'ch-chem12-2',
    type: 'la',
    marks: 5,
    text: 'State Kohlrausch law of independent migration of ions. Calculate the limiting molar conductivity of acetic acid given limiting molar conductivities of HCl, NaCl and CH3COONa.',
    answer: 'Kohlrausch law: Λ°m = ν+λ°+ + ν-λ°-. Λ°m(CH3COOH) = Λ°m(CH3COONa) + Λ°m(HCl) - Λ°m(NaCl).',
    answerLinesCount: 12
  },

  // Class 10 Science
  {
    id: 'q-sci-1',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-1',
    type: 'mcq',
    marks: 1,
    text: 'Which of the following is an example of an exothermic reaction?',
    options: [
      'A) Photosynthesis',
      'B) Respiration',
      'C) Decomposition of calcium carbonate',
      'D) Evaporation of water'
    ],
    answer: 'B) Respiration',
    answerLinesCount: 1
  },
  {
    id: 'q-sci-2',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-1',
    type: 'fillups',
    marks: 1,
    text: 'A chemical reaction in which heat is evolved is known as an __________ reaction.',
    answer: 'exothermic',
    answerLinesCount: 1
  },
  {
    id: 'q-sci-3',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-1',
    type: 'true_false',
    marks: 1,
    text: 'Rusting of iron is an irreversible oxidation-reduction reaction.',
    answer: 'True',
    answerLinesCount: 1
  },
  {
    id: 'q-sci-4',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-2',
    type: 'matching',
    marks: 4,
    text: 'Match the common chemical substance with its correct chemical formula:',
    matchPairs: [
      { left: '1. Bleaching Powder', right: 'a) NaHCO3' },
      { left: '2. Baking Soda', right: 'b) CaOCl2' },
      { left: '3. Washing Soda', right: 'c) CaSO4 · ½ H2O' },
      { left: '4. Plaster of Paris', right: 'd) Na2CO3 · 10H2O' }
    ],
    answer: '1 -> b, 2 -> a, 3 -> d, 4 -> c',
    answerLinesCount: 4
  },
  {
    id: 'q-sci-5',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-1',
    type: 'vsa',
    marks: 2,
    text: 'Why does the color of copper sulphate solution change when an iron nail is dipped in it?',
    answer: 'Because iron is more reactive than copper and displaces it from CuSO4 solution to form greenish FeSO4.',
    answerLinesCount: 3
  },
  {
    id: 'q-sci-6',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-4',
    type: 'sa',
    marks: 3,
    text: 'Explain the role of bile juice and pancreatic enzymes in the digestion of human beings.',
    answer: 'Bile emulsifies large fat globules and creates an alkaline medium. Pancreatic juice contains amylase for starch, trypsin for proteins, and lipase for emulsified fats.',
    answerLinesCount: 6
  },
  {
    id: 'q-sci-7',
    bookId: 'book-sci-10',
    chapterId: 'ch-sci-6',
    type: 'la',
    marks: 5,
    text: 'State Snell’s law of refraction. A ray of light enters from water into glass with refractive indices 1.33 and 1.50 respectively. Draw a labeled ray diagram and calculate the relative refractive index of glass with respect to water.',
    answer: 'Snell\'s law: sin(i)/sin(r) = constant. Refractive index = 1.50 / 1.33 = 1.127. Light bends towards the normal as it enters an optically denser medium.',
    answerLinesCount: 12
  },

  // Class 10 Mathematics
  {
    id: 'q-math-1',
    bookId: 'book-math-10',
    chapterId: 'ch-math-1',
    type: 'mcq',
    marks: 1,
    text: 'If HCF(306, 657) = 9, what is the LCM(306, 657)?',
    options: [
      'A) 22338',
      'B) 22838',
      'C) 3069',
      'D) 5913'
    ],
    answer: 'A) 22338',
    answerLinesCount: 1
  },
  {
    id: 'q-math-2',
    bookId: 'book-math-10',
    chapterId: 'ch-math-4',
    type: 'fillups',
    marks: 1,
    text: 'For a quadratic equation ax² + bx + c = 0 to have two distinct real roots, the discriminant b² - 4ac must be __________ 0.',
    answer: 'greater than (> 0)',
    answerLinesCount: 1
  },
  {
    id: 'q-math-3',
    bookId: 'book-math-10',
    chapterId: 'ch-math-5',
    type: 'true_false',
    marks: 1,
    text: 'The common difference of an Arithmetic Progression can be negative, positive, or zero.',
    answer: 'True',
    answerLinesCount: 1
  },
  {
    id: 'q-math-4',
    bookId: 'book-math-10',
    chapterId: 'ch-math-7',
    type: 'matching',
    marks: 4,
    text: 'Match the trigonometric ratio with its exact value:',
    matchPairs: [
      { left: '1. sin 30°', right: 'a) 1' },
      { left: '2. cos 45°', right: 'b) 1/2' },
      { left: '3. tan 45°', right: 'c) 1/√2' },
      { left: '4. sin 60°', right: 'd) √3/2' }
    ],
    answer: '1 -> b, 2 -> c, 3 -> a, 4 -> d',
    answerLinesCount: 4
  },
  {
    id: 'q-math-5',
    bookId: 'book-math-10',
    chapterId: 'ch-math-2',
    type: 'vsa',
    marks: 2,
    text: 'Find a quadratic polynomial whose sum and product of zeroes are -3 and 2 respectively.',
    answer: 'p(x) = x² - (sum)x + product = x² - (-3)x + 2 = x² + 3x + 2.',
    answerLinesCount: 3
  },
  {
    id: 'q-math-6',
    bookId: 'book-math-10',
    chapterId: 'ch-math-5',
    type: 'sa',
    marks: 3,
    text: 'The 17th term of an AP exceeds its 10th term by 7. Find the common difference of the AP.',
    answer: 'a_17 = a + 16d, a_10 = a + 9d. (a + 16d) - (a + 9d) = 7 => 7d = 7 => d = 1.',
    answerLinesCount: 6
  },
  {
    id: 'q-math-7',
    bookId: 'book-math-10',
    chapterId: 'ch-math-7',
    type: 'la',
    marks: 5,
    text: 'Prove that: (sin θ - 2 sin³ θ) / (2 cos³ θ - cos θ) = tan θ. Also state the trigonometric identities utilized.',
    answer: 'Numerator: sin θ(1 - 2 sin² θ) = sin θ(cos 2θ). Denominator: cos θ(2 cos² θ - 1) = cos θ(cos 2θ). Ratio = tan θ.',
    answerLinesCount: 12
  }
];

export const QUESTION_TYPES_CONFIG = [
  { id: 'fillups', label: 'Fill in the Blanks', defaultMarks: 1, defaultLines: 1 },
  { id: 'mcq', label: 'Multiple Choice Questions (MCQ)', defaultMarks: 1, defaultLines: 1 },
  { id: 'true_false', label: 'True / False', defaultMarks: 1, defaultLines: 1 },
  { id: 'matching', label: 'Match the Following', defaultMarks: 4, defaultLines: 4 },
  { id: 'vsa', label: 'Very Short Answers (VSA)', defaultMarks: 2, defaultLines: 3 },
  { id: 'sa', label: 'Short Answers (SA)', defaultMarks: 3, defaultLines: 6 },
  { id: 'la', label: 'Long Answers (LA)', defaultMarks: 5, defaultLines: 12 }
];
