import {
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  OutlinedInput,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Lists from "./Lists";
import { makeStyles } from "@mui/styles";
import { submitModel } from "../../actions/modelAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import LoadingDialog from "./LoadingDialog";
import EditDialog from "../common/EditDialog";
import { withStyles } from "@mui/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import HelpIcon from '@mui/icons-material/Help';
import rg from "../../static/images/rg.gif";
import TutorialComponent from "../common/TutorialComponent";
import QuizDialog from "../common/QuizDialog";
import EducationalFAB from "../common/Fab";
import {
  mlTutorialData,
  dataBasicsTutorialData,
  dataPreprocessingTutorialData,
  modelTrainingTutorialData,
  modelEvaluationTutorialData,
  mlQuizQuestions,
  dataBasicsQuizQuestions,
  dataPreprocessingQuizQuestions,
  modelTrainingQuizQuestions,
  modelEvaluationQuizQuestions
} from '../common/LearningContent';

// Import images for tutorials
import im from "../../static/images/Import Page.gif";
import dts from "../../static/images/dataset.gif";
import dpd from "../../static/images/dependent.gif";
import idpd from "../../static/images/independent.gif";
import asset1 from "../../static/images/land/asset-1.png";
import ml from "../../static/images/Home Page.gif";
import ml2 from "../../static/images/howitwork.gif";
import ml3 from "../../static/images/typeofml.gif";
import sl from "../../static/images/supervisedl.gif";
import cl from "../../static/images/cl.gif";
import t1 from "../../static/images/Training1.gif";
import t2 from "../../static/images/Training2.gif";
import t3 from "../../static/images/Training3.gif";
import t4 from "../../static/images/Training4.gif";
import t5 from "../../static/images/Training5.svg";
import t6 from "../../static/images/Training6.gif";
import t7 from "../../static/images/Training7.gif";
import t8 from "../../static/images/Training8.gif";
import t9 from "../../static/images/Training9.gif";
import t10 from "../../static/images/Training10.gif";
import t11 from "../../static/images/Training11.gif";


const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#5C5C5C',
    color: '#ffffff',
    minWidth: "450px",
    textAlign: "center",
    fontSize: theme.typography.pxToRem(14),
    border: '1px solid #dadde9',
    borderRadius: '10px',
    padding: '1em',
    fontFamily: "'SF Pro Display', sans-serif",

  },
}));

const CustomTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(Tooltip);

const useStyles = makeStyles({
  root: {
    width: "125px",
    height: "62px",
    padding: "0px",
  },
  switchBase: {
    color: "#818181",
    padding: "1px",
    "&$checked": {
      "& + $track": {
        backgroundColor: "#23bf58",
      },
    },
  },
  thumb: {
    color: "white",
    width: "56px",
    height: "56px",
    margin: "2px",
  },
  track: {
    borderRadius: "30px",
    backgroundColor: "#818181",
    opacity: "1 !important",
    "&:after, &:before": {
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
      position: "absolute",
      top: "19px",
    },
    "&:after": {
      content: "'Auto'",
      left: "19px",
    },
    "&:before": {
      content: "'Manual'",
      right: "6px",
    },
  },
  checked: {
    color: "#23bf58 !important",
    transform: "translateX(62px) !important",
  },
});

const classificationAlgos = [
  {
    name: "Logistic Regression",
    value: "LogisticRegression",
    tooltip:
      "Choose Logistic Regression when you have a binary classification problem with two possible outcomes, like 'yes' or 'no.'It's like a straightforward yes-or-no decision maker for simple problems.",
  },
  {
    name: "Random Forest Classifier",
    value: "RandomForestClassifier",
    tooltip:
      "Consider the Random Forest Classifier when you have a complex classification task with many features. It's like a team of experts voting on a decision, which is helpful for tough decisions with lots of factors.",
  },
  {
    name: "Gradient Boosting Classifier",
    value: "GradientBoostingClassifier",
    tooltip:
      "Gradient Boosting when you need highly accurate predictions and can afford longer training times. It's like a sports team that learns from its mistakes and keeps getting better over time.",
  },
  {
    name: "Decision Tree Classifier",
    value: "DecisionTreeClassifier",
    tooltip:
      "Use a decision tree classifier when you need a model that's easy to understand and can handle a mix of data types. It's like a flowchart that splits the data into branches until it finds the best answers.",
  },
  {
    name: "XGB Classifier",
    value: "XGBClassifier",
    tooltip:
      "Opt for XGBoost when you need top-notch performance and have a large dataset with intricate patterns. Think of it as having a super-smart friend who finds hidden patterns in your data.",
  },
];

const regressionAlgos = [
  {
    name: "Random Forest Regressor",
    value: "RandomForestRegressor",
    tooltip:
      "Go for the Random Forest Regressor when you need to predict continuous values and have multiple input features. It's like getting opinions from multiple appraisers to estimate a house's value.",
  },
  {
    name: "Gradient Boosting Regressor",
    value: "GradientBoostingRegressor",
    tooltip:
      "Consider the Gradient Boosting Regressor when you need high prediction accuracy and can invest more time in training. It's like a teacher who helps you improve your test scores over time.",
  },
  {
    name: "Extra Trees Regressor",
    value: "ExtraTreesRegressor",
    tooltip:
      "Use the Extra Trees Regressor for simpler and faster regression tasks when precision is not the primary concern. Think of it as a quick and simple tool for making predictions.",
  },
];

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// ML Tutorial Data
// const mlTutorialData = {
//   "tab1": {
//     label: "Machine Learning",
//     title: "Machine Learning (ML)",
//     subtitle: "An Introduction to How Machines Learn and Adapt",
//     image: ml,
//     sections: [
//       {
//         id: "ml_basics_1",
//         title: "What is Machine Learning?",
//         content: "Machine Learning (ML) is a subset of Artificial Intelligence (AI). It allows computers to learn and improve from data without explicit programming. It's like teaching a computer by showing it examples until it understands patterns. ML is used in various tasks, from predicting house prices to diagnosing diseases. It's everywhere—from self-driving cars to personalized recommendations!",
//         image: ml
//       },
//       {
//         id: "ml_basics_2",
//         title: "How Does it Work?",
//         content: "ML works through a series of steps: first, define the problem you want to solve (e.g., predicting house prices). Then, collect relevant data and preprocess it to clean and prepare for analysis. Next, train a model using this data to learn patterns and relationships. Finally, evaluate the model to see how well it performs, ensuring it's ready to make accurate predictions.",
//         image: ml2
//       },
//       {
//         id: "ml_basics_3",
//         title: "Types of ML",
//         content: "Machine Learning has three main approaches: Supervised learning uses labeled data to teach models, Unsupervised learning explores data to find hidden patterns, and Reinforcement learning improves through trial and error feedback. Conservation tasks often use supervised learning to predict species richness or identify priority habitats.",
//         image: ml3
//       }
//     ]
//   },
//   "tab2": {
//     label: "Supervised Learning",
//     title: "Supervised Learning",
//     subtitle: "Learning from Labeled Data to Make Predictions",
//     image: sl,
//     sections: [
//       {
//         id: "supervised_1",
//         title: "What is Supervised Learning?",
//         content: "Supervised learning is a type of machine learning where models are trained using labeled data. This means the dataset includes both input features (independent variables) and their corresponding correct outputs (dependent variable or target). The model identifies patterns to predict outcomes for new, unseen data. It includes two key types: classification (categorizing data) and regression (predicting numerical values).",
//         image: sl
//       },
//       {
//         id: "supervised_2",
//         title: "What is Classification?",
//         content: "Classification is about sorting data into different categories or classes. It's like having a bunch of different baskets and teaching a computer which basket to put each new item into based on its characteristics. For example, sorting emails into spam or inbox, or classifying bird species by photos. It is ideal for problems with distinct, non-overlapping outcomes. It answers \"Yes or No\" questions, or \"Which category does this belong to?\" It's all about putting things into the right groups",
//         image: cl
//       },
//       {
//         id: "supervised_3",
//         title: "What is Regression?",
//         content: "Regression helps in situations where you need to forecast a quantity or continuous numerical values. For example, predicting future sales figures, housing prices, or temperature. It's useful for answering questions like \"How much?\" or \"How many?\" The goal is to come up with a model that can take your inputs and forecast a number as accurately as possible.",
//         image: rg
//       }
//     ]
//   }
// };

// Data Basics Tutorial Data
// const dataBasicsTutorialData = {
//   "tab1": {
//     label: "Data Basics",
//     title: "Data Basics",
//     subtitle: "Understanding the Foundation of Machine Learning",
//     image: im,
//     sections: [
//       {
//         id: "section1_1",
//         title: "Types of data",
//         content: "There are two types of data in machine learning: numerical and categorical. Numerical data includes continuous values, like height or temperature, and discrete counts, like the number of rooms in a house. Categorical data is divided into nominal categories, which have no order (e.g., colors like red, blue), and ordinal categories, which have a meaningful order (e.g., rankings like small, medium, large). Both types are essential to represent diverse information and uncover patterns in machine learning tasks.",
//         image: im
//       },
//       {
//         id: "section1_2",
//         title: "What kind of dataset can be used for ML?",
//         content: "Imagine you're putting together a puzzle. To do this, you need two things: the puzzle pieces (features) and the picture on the box to guide you (target). In machine learning, datasets work the same way. Machine learning uses datasets with input features and a target variable to teach models how to make predictions.",
//         image: dts
//       }
//     ]
//   }
// };

// Data Preprocessing Tutorial Data
// const dataPreprocessingTutorialData = {
//   "tab1": {
//     label: "Data Preprocessing",
//     title: "Data Preprocessing",
//     subtitle: "Understanding Data Quality and Preparation",
//     image: rg,
//     sections: [
//       {
//         id: "preprocessing_1",
//         title: "What is Data Preprocessing?",
//         content: "Data preprocessing is the crucial step of preparing and cleaning raw data before training a machine learning model. It involves handling missing values, removing duplicates, dealing with outliers, and transforming data into a suitable format. Good preprocessing ensures your model learns from quality data, leading to better predictions.",
//         image: rg
//       },
//       {
//         id: "preprocessing_2",
//         title: "Handling Missing Values",
//         content: "Missing values can significantly impact model performance. Common strategies include: removing rows with missing values (if data is abundant), imputing with mean/median/mode values, or using advanced imputation techniques. The choice depends on your data size and the nature of missing values.",
//         image: rg
//       }
//     ]
//   },
//   "tab2": {
//     label: "Feature Engineering",
//     title: "Feature Engineering",
//     subtitle: "Creating Better Features for ML Models",
//     image: rg,
//     sections: [
//       {
//         id: "feature_1",
//         title: "What is Feature Engineering?",
//         content: "Feature engineering is the art of creating new, meaningful features from existing data. This might involve combining variables, creating interaction terms, or transforming variables to better represent underlying patterns. Good feature engineering can dramatically improve model performance.",
//         image: rg
//       }
//     ]
//   }
// };

// // ML Quiz Questions
// const mlQuizQuestions = [
//   {
//     question: "What is Machine Learning?",
//     options: [
//       "A programming language",
//       "A type of computer hardware",
//       "A field where computers learn from data without explicit programming",
//       "A database management system"
//     ],
//     correctAnswer: "A field where computers learn from data without explicit programming",
//     explanation: "Machine Learning is a subset of AI where systems learn patterns from data to make predictions or decisions without being explicitly programmed."
//   },
//   {
//     question: "What is the main difference between supervised and unsupervised learning?",
//     options: [
//       "The amount of data used",
//       "The presence of labeled training data",
//       "The processing speed",
//       "The number of features"
//     ],
//     correctAnswer: "The presence of labeled training data",
//     explanation: "Supervised learning uses labeled data for training, while unsupervised learning finds patterns in unlabeled data."
//   },
//   {
//     question: "What is a feature in machine learning?",
//     options: [
//       "A software bug",
//       "An input variable or attribute used for prediction",
//       "The final output of the model",
//       "A type of machine learning algorithm"
//     ],
//     correctAnswer: "An input variable or attribute used for prediction",
//     explanation: "Features are the input variables or attributes that are used by machine learning models to make predictions."
//   }
// ];

// // Data Basics Quiz Questions
// const dataBasicsQuizQuestions = [
//   {
//     question: "What are the two main types of data in machine learning?",
//     options: [
//       "Binary and textual data",
//       "Numerical and categorical data",
//       "Structured and unstructured data",
//       "Integer and floating-point data"
//     ],
//     correctAnswer: "Numerical and categorical data",
//     explanation: "Machine learning data is primarily divided into numerical data (continuous values and discrete counts) and categorical data (nominal and ordinal categories)."
//   },
//   {
//     question: "How is categorical data classified?",
//     options: [
//       "Binary and continuous",
//       "Integer and decimal",
//       "Nominal (no order) and ordinal (with order)",
//       "Quantitative and qualitative"
//     ],
//     correctAnswer: "Nominal (no order) and ordinal (with order)",
//     explanation: "Categorical data is divided into nominal categories with no inherent order (like colors) and ordinal categories with meaningful order (like size rankings)."
//   },
//   {
//     question: "What is the relationship between features and the target variable?",
//     options: [
//       "Targets are used to predict features",
//       "Features are used to predict the target variable",
//       "Features and targets are the same thing",
//       "There is no relationship between them"
//     ],
//     correctAnswer: "Features are used to predict the target variable",
//     explanation: "Features (independent variables) are used as inputs to predict or explain the target variable (dependent variable)."
//   }
// ];

// // Data Preprocessing Quiz Questions
// const dataPreprocessingQuizQuestions = [
//   {
//     question: "Why is data preprocessing important in machine learning?",
//     options: [
//       "It makes the data look prettier",
//       "It improves model performance by cleaning and preparing data",
//       "It reduces the size of the dataset",
//       "It makes training faster"
//     ],
//     correctAnswer: "It improves model performance by cleaning and preparing data",
//     explanation: "Data preprocessing is crucial as it ensures the model learns from clean, well-prepared data, leading to better predictions and more reliable results."
//   },
//   {
//     question: "What is a common way to handle missing values?",
//     options: [
//       "Always delete rows with missing values",
//       "Ignore them during training",
//       "Replace them with mean/median values",
//       "Use random values"
//     ],
//     correctAnswer: "Replace them with mean/median values",
//     explanation: "Imputing missing values with mean/median is a common strategy that preserves data while maintaining statistical properties."
//   },
//   {
//     question: "What is feature scaling used for?",
//     options: [
//       "To make features look better in visualizations",
//       "To normalize features to a similar range",
//       "To increase the number of features",
//       "To remove features"
//     ],
//     correctAnswer: "To normalize features to a similar range",
//     explanation: "Feature scaling ensures all features contribute equally to the model by bringing them to a similar scale."
//   },
//   {
//     question: "What is one-hot encoding used for?",
//     options: [
//       "To compress the data",
//       "To convert categorical variables to numerical format",
//       "To remove outliers",
//       "To create new features"
//     ],
//     correctAnswer: "To convert categorical variables to numerical format",
//     explanation: "One-hot encoding converts categorical variables into a format that can be provided to ML algorithms by creating binary columns."
//   },
//   {
//     question: "What is an outlier?",
//     options: [
//       "A missing value in the dataset",
//       "A value that is significantly different from other observations",
//       "A duplicate entry",
//       "A categorical variable"
//     ],
//     correctAnswer: "A value that is significantly different from other observations",
//     explanation: "Outliers are data points that deviate significantly from the overall pattern of the dataset."
//   },
//   {
//     question: "Why is feature selection important?",
//     options: [
//       "To make the dataset smaller",
//       "To improve model performance and reduce overfitting",
//       "To make training faster",
//       "To create more features"
//     ],
//     correctAnswer: "To improve model performance and reduce overfitting",
//     explanation: "Feature selection helps identify the most relevant features, reducing noise and preventing overfitting."
//   }
// ];

// // Model Training Tutorial Data
// const modelTrainingTutorialData = {
//   "tab1": {
//     label: "Algorithm",
//     title: "Algorithm",
//     subtitle: "Understanding the Role of Algorithms in ML",
//     image: rg,
//     sections: [
//       {
//         id: "section1_1",
//         title: "What is an algorithm in ML?",
//         content: "An algorithm in machine learning is a set of rules or steps the model follows to learn patterns from data. It processes input data, identifies relationships, and uses them to make predictions. Different algorithms are suited for different types of problems, such as predicting numbers or classifying data into categories.",
//         image: t1
//       },
//       {
//         id: "section1_2",
//         title: "Logistic regression",
//         content: "Logistic regression is a simple yet powerful algorithm used for classification tasks. It predicts the probability of a data point belonging to a particular class, like determining if an email is spam or not. Instead of a straight line, it uses an \"S-shaped\" curve to map inputs to probabilities, making it ideal for binary outcomes like yes/no or pass/fail.",
//         image: t2
//       },
//       {
//         id: "section1_3",
//         title: "Decision tree",
//         content: "Decision trees work by splitting data into branches based on feature values. They are easy to understand, handle both numerical and categorical data, and are commonly used for classification and regression problems.",
//         image: t3
//       }
//     ]
//   },
//   "tab2": {
//     label: "Training, Validation, Test Split",
//     title: "Training, Validation, Test Split",
//     subtitle: "Why Splitting Data Matters for Model Accuracy",
//     image: rg,
//     sections: [
//       {
//         id: "section2_1",
//         title: "What is the optimal split ratio?",
//         content: "A common split is 70-80% for training, and 10-15% for testing. The training data helps the model learn, validation data fine-tunes it, and test data evaluates its accuracy on unseen information.",
//         image: t4
//       },
//       {
//         id: "section2_2",
//         title: "Why is split ratio important?",
//         content: "Proper split ratios prevent overfitting or underfitting. Training data teaches the model, validation helps adjust parameters, and testing ensures the model generalizes well to new data. Without a good split, your model might perform well on training data but fail in real-world scenarios.",
//         image: t5
//       }
//     ]
//   },
//   "tab3": {
//     label: "Prediction & ID Column",
//     title: "Prediction & ID Column",
//     subtitle: "Understanding Key Columns in Your Dataset",
//     image: rg,
//     sections: [
//       {
//         id: "section3_1",
//         title: "What is prediction column?",
//         content: "The prediction column is the dependent variable (target) that the model is trained to predict. For example, in a dataset about house sales, the prediction column could be \"Price.\" It contains the actual outcomes the model compares its predictions to during evaluation.",
//         image: t6
//       },
//       {
//         id: "section3_2",
//         title: "What is ID column?",
//         content: "The ID column contains unique identifiers for each data entry, such as transaction IDs or user IDs. While essential for tracking or organizing data, ID columns are not used for training as they do not provide meaningful patterns for predictions.",
//         image: t7
//       }
//     ]
//   },
//   "tab4": {
//     label: "Feature Selection",
//     title: "Feature Selection",
//     subtitle: "Choosing the Right Features for Better Models",
//     image: rg,
//     sections: [
//       {
//         id: "section4_1",
//         title: "What is feature selection?",
//         content: "Feature selection is the process of identifying the most relevant inputs (features) for a model. It reduces the dataset to focus on critical variables that impact predictions, removing redundant or irrelevant data. This improves model efficiency and accuracy. For example, when predicting house prices, focusing on features like location and square footage is more useful than including unrelated details like the color of the mailbox.",
//         image: t8
//       },
//       {
//         id: "section4_2",
//         title: "Why is feature selection important?",
//         content: "(1) Avoid Overfitting: Reduces the risk of the model learning irrelevant patterns; (2) Save Time: Speeds up training by focusing on fewer, essential features; (3) Improve Accuracy: Eliminates noise from unnecessary data, enhancing model performance. Imagine trying to guess a cake's flavor based on hundreds of random ingredients; selecting only the key ones, like chocolate or vanilla, makes it easier to identify.",
//         image: t9
//       },
//       {
//         id: "section4_3",
//         title: "Which features to prioritize?",
//         content: "Prioritizing features is like packing for a trip: essential items (e.g., passport, clothes) are like key features which are critical for success. Useful extras (e.g., a power bank) are moderately relevant, adding convenience but not vital. Unnecessary items (e.g., ski boots for a beach trip) are irrelevant and only add clutter. Choosing the right features ensures your model is efficient and accurate, just like smart packing makes your journey smoother.",
//         image: t10
//       },
//       {
//         id: "section4_4",
//         title: "Example of feature selection methods",
//         content: "Feature selection methods include: (1) Domain Knowledge involves relying on expert insights to identify the most important features; (2) Correlation Analysis focuses on measuring the relationships between features and the target variable to determine which are most significant; (3) Recursive Feature Elimination is a technique that ranks features based on their contribution to the model and removes the least important ones through an iterative process. Usually, the process begins with domain knowledge to establish essential features and then use correlation and algorithmic methods to refine the selection.",
//         image: t11
//       }
//     ]
//   }
// };

// // Model Training Quiz Questions
// const modelTrainingQuizQuestions = [
//   {
//     question: "What is a machine learning algorithm?",
//     options: [
//       "A type of computer hardware",
//       "A set of rules or steps the model follows to learn patterns from data",
//       "A database management system",
//       "The final output of model training"
//     ],
//     correctAnswer: "A set of rules or steps the model follows to learn patterns from data",
//     explanation: "An algorithm in machine learning is a set of rules or steps the model follows to learn patterns from data. It processes input data, identifies relationships, and uses them to make predictions."
//   },
//   {
//     question: "What is logistic regression primarily used for?",
//     options: [
//       "Predicting numerical values",
//       "Classification tasks",
//       "Feature selection",
//       "Data cleaning"
//     ],
//     correctAnswer: "Classification tasks",
//     explanation: "Logistic regression is a simple yet powerful algorithm used for classification tasks. It predicts the probability of a data point belonging to a particular class, like determining if an email is spam or not."
//   },
//   {
//     question: "What is the recommended split ratio for training and test data?",
//     options: [
//       "50-50 split",
//       "70-80% for training, 10-15% for testing",
//       "90-10 split",
//       "100-0 split"
//     ],
//     correctAnswer: "70-80% for training, 10-15% for testing",
//     explanation: "A common split is 70-80% for training and 10-15% for testing. The training data helps the model learn, while test data evaluates its accuracy on unseen information."
//   },
//   {
//     question: "Why is a proper data split ratio important?",
//     options: [
//       "It makes training faster",
//       "It reduces the size of the dataset",
//       "It prevents overfitting or underfitting",
//       "It eliminates the need for validation"
//     ],
//     correctAnswer: "It prevents overfitting or underfitting",
//     explanation: "Proper split ratios prevent overfitting or underfitting. Without a good split, your model might perform well on training data but fail in real-world scenarios."
//   },
//   {
//     question: "What is the prediction column in a dataset?",
//     options: [
//       "A column containing the model's guesses",
//       "The dependent variable that the model is trained to predict",
//       "A column of randomly generated values for testing",
//       "A column used only during validation"
//     ],
//     correctAnswer: "The dependent variable that the model is trained to predict",
//     explanation: "The prediction column is the dependent variable (target) that the model is trained to predict. It contains the actual outcomes the model compares its predictions to during evaluation."
//   },
//   {
//     question: "Why are ID columns not used for training?",
//     options: [
//       "They contain too many unique values",
//       "They are too difficult to process",
//       "They do not provide meaningful patterns for predictions",
//       "They would make the model too accurate"
//     ],
//     correctAnswer: "They do not provide meaningful patterns for predictions",
//     explanation: "While essential for tracking or organizing data, ID columns are not used for training as they do not provide meaningful patterns for predictions."
//   },
//   {
//     question: "What is feature selection?",
//     options: [
//       "Creating new features from existing ones",
//       "Identifying the most relevant inputs for a model",
//       "Selecting which model to use",
//       "Determining how many categories to include"
//     ],
//     correctAnswer: "Identifying the most relevant inputs for a model",
//     explanation: "Feature selection is the process of identifying the most relevant inputs (features) for a model. It reduces the dataset to focus on critical variables that impact predictions, removing redundant or irrelevant data."
//   },
//   {
//     question: "Which of the following is NOT a benefit of feature selection?",
//     options: [
//       "Reduces the risk of overfitting",
//       "Speeds up training",
//       "Guarantees 100% model accuracy",
//       "Eliminates noise from unnecessary data"
//     ],
//     correctAnswer: "Guarantees 100% model accuracy",
//     explanation: "Feature selection helps avoid overfitting, saves time by focusing on fewer features, and improves accuracy by eliminating noise, but it cannot guarantee 100% model accuracy as other factors also affect model performance."
//   }
// ];

const Body = ({ backDialogOpen, setBackDialogOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { response, model, name, type, mode } = useSelector((state) => state.model);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [columns, setColumns] = useState([]);
  const [isAuto, setIsAuto] = useState("Auto");
  const [algoValue, setAlgoValue] = useState("");
  const navigate = useNavigate();
  const [elements, setElements] = useState({
    "Prediction Column": [],
    "ID Column": [],
    "Columns not to use": [],
    "Columns to use": []
  });
  const [unit, setUnit] = useState("");
  const [label0, setLabel0] = useState("");
  const [label1, setLabel1] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [tooltipId, setTooltipId] = useState(0);

  // FAB state management
  const [fabOpen, setFabOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTutorialData, setCurrentTutorialData] = useState(modelTrainingTutorialData);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState(modelTrainingQuizQuestions);
  
  const [fabTasks, setFabTasks] = useState([
    {
      id: 'tutorial-1',
      type: 'tutorial',
      title: 'Machine Learning Tutorial',
      description: 'Learn the fundamentals of ML and AutoML',
      completed: false,
      started: false
    },
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Machine Learning Quiz',
      description: 'Test your knowledge of ML concepts',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-2',
      type: 'tutorial',
      title: 'Data Basics Tutorial',
      description: 'Learn about data preprocessing and analysis',
      completed: false,
      started: false
    },
    {
      id: 'quiz-2',
      type: 'quiz',
      title: 'Data Basics Quiz',
      description: 'Test your knowledge of data concepts',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-3',
      type: 'tutorial',
      title: 'Data Preprocessing Tutorial',
      description: 'Learn about data cleaning and preparation',
      completed: false,
      started: false
    },
    {
      id: 'quiz-3',
      type: 'quiz',
      title: 'Data Preprocessing Quiz',
      description: 'Test your knowledge of data preprocessing',
      completed: false,
      started: false
    },
    {
      id: 'tutorial-4',
      type: 'tutorial',
      title: 'Model Training Tutorial',
      description: 'Learn about algorithm selection, data splitting, and column mapping',
      category: "Model Training",
      completed: false,
      started: false
    },
    {
      id: 'quiz-4',
      type: 'quiz',
      title: 'Model Training Quiz',
      description: 'Test your knowledge of model training concepts',
      category: "Model Training",
      completed: false,
      started: false
    }
  ]);

  const [learningProgress, setLearningProgress] = useState([
    { 
      name: "Machine\nLearning",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Data\nBasics",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Data\nPreprocessing",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Model\nTraining",
      tutorialComplete: false, 
      quizComplete: false 
    },
    { 
      name: "Model\nEvaluation",
      tutorialComplete: false, 
      quizComplete: false 
    }
  ]);

  // FAB event handlers
  const handleFabToggle = () => {
    setFabOpen(!fabOpen);
  };

  const handleTaskStart = (taskId) => {
    dispatch({ type: "START_TASK", payload: taskId });

    // Set tutorial/quiz data based on task ID
    if (taskId.startsWith('tutorial')) {
      setShowTutorial(true);
      switch(taskId) {
        case 'tutorial-1':
          setCurrentTutorialData(mlTutorialData);
          break;
        case 'tutorial-2':
          setCurrentTutorialData(dataBasicsTutorialData);
          break;
        case 'tutorial-3':
          setCurrentTutorialData(dataPreprocessingTutorialData);
          break;
        case 'tutorial-4':
          setCurrentTutorialData(modelTrainingTutorialData);
          break;
        case 'tutorial-5':
          setCurrentTutorialData(modelEvaluationTutorialData);
          break;
      }
    } else if (taskId.startsWith('quiz')) {
      setShowQuiz(true);
      switch(taskId) {
        case 'quiz-1':
          setCurrentQuizQuestions(mlQuizQuestions);
          break;
        case 'quiz-2':
          setCurrentQuizQuestions(dataBasicsQuizQuestions);
          break;
        case 'quiz-3':
          setCurrentQuizQuestions(dataPreprocessingQuizQuestions);
          break;
        case 'quiz-4':
          setCurrentQuizQuestions(modelTrainingQuizQuestions);
          break;
        case 'quiz-5':
          setCurrentQuizQuestions(modelEvaluationQuizQuestions);
          break;
      }
    }
  };

  const handleTaskComplete = (taskId) => {
    dispatch({ type: "COMPLETE_TASK", payload: taskId });
    
    // Get section index from task ID
    const sectionIndex = parseInt(taskId.slice(-1)) - 1;
    
    if (sectionIndex >= 0 && sectionIndex < 5) {
      dispatch({ 
        type: "UPDATE_PROGRESS", 
        payload: {
          sectionIndex,
          type: taskId.includes('tutorial') ? 'tutorial' : 'quiz',
          complete: true
        }
      });
    }
  };

  const handleTutorialComplete = () => {
    const currentTutorialId = currentTutorialData === mlTutorialData ? 'tutorial-1' : 
                            currentTutorialData === dataBasicsTutorialData ? 'tutorial-2' : 
                            currentTutorialData === dataPreprocessingTutorialData ? 'tutorial-3' :
                            currentTutorialData === modelTrainingTutorialData ? 'tutorial-4' :
                            'tutorial-5';
    handleTaskComplete(currentTutorialId);
    setShowTutorial(false);
  };

  const handleQuizComplete = (score) => {
    const currentQuizId = currentQuizQuestions === mlQuizQuestions ? 'quiz-1' : 
                         currentQuizQuestions === dataBasicsQuizQuestions ? 'quiz-2' : 
                         currentQuizQuestions === dataPreprocessingQuizQuestions ? 'quiz-3' :
                         currentQuizQuestions === modelTrainingQuizQuestions ? 'quiz-4' :
                         'quiz-5';
    handleTaskComplete(currentQuizId);
    setShowQuiz(false);
  };

  const handleQuizRedo = () => {
    // Get current quiz ID
    const currentQuizId = currentQuizQuestions === mlQuizQuestions ? 'quiz-1' : 
                         currentQuizQuestions === dataBasicsQuizQuestions ? 'quiz-2' : 
                         currentQuizQuestions === dataPreprocessingQuizQuestions ? 'quiz-3' :
                         currentQuizQuestions === modelTrainingQuizQuestions ? 'quiz-4' :
                         'quiz-5';
    
    // Get section index from quiz ID
    const sectionIndex = parseInt(currentQuizId.slice(-1)) - 1;
    
    dispatch({ 
      type: "UPDATE_PROGRESS",
      payload: {
        sectionIndex,
        type: 'quiz',
        complete: false
      }
    });
    dispatch({ type: "RESET_TASK", payload: currentQuizId });
    setShowQuiz(true);
    // Keep current quiz questions
  };

  const handleOpen = () => { };

  const handleClose = () => { };

  useEffect(() => {
    setTooltipId(mode);
  }, [mode]);

  useEffect(() => {
    console.log("Select dispatch",tooltipId);
    if (tooltipId === 23 || tooltipId === 34) dispatch({ type: "TOGGLE_MODE", payload: tooltipId });
    console.log("After Select Dispatch Mode:",mode);
    console.log("After Select Dispatch TooltipID:",tooltipId);
  }, [tooltipId])

  const handleBack = () => {
    setBackDialogOpen(true);
  };
  useEffect(() => {
    if (elements["Prediction Column"].length === 1 && isAuto === "Auto") {
      setDisabled(false);
    } else if (elements["Prediction Column"].length === 1 && isAuto === "Manual") {
      if (algoValue !== "") {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else if (
      elements["Prediction Column"].length === 0 ||
      (isAuto === "Auto" && algoValue === "")
    ) {
      setDisabled(true);
    }

  }, [algoValue, elements, isAuto]);
  useEffect(() => {
    if (response && response.columns) {
      setColumns(response.columns);
    }
  }, [response]);
  const handleChecked = (e) => {
    setAlgoValue("");
    // setIsAuto(e.target.checked);
    setIsAuto(prev => {
      if (prev === "Auto")
        return "Manual";
      else
        return "Auto";
    })
  };
  const handleAlgoChange = (e) => {
    setAlgoValue(e.target.value);
  };
  const onClick = (e) => {
    const auto = isAuto === "Auto" ? true : false;
    dispatch(
      submitModel({
        elements,
        auto: auto,
        algo: algoValue,
        unit,
        label0,
        label1,
        split,
      })
    );
    setLoadingOpen(true);
  };

  function valueLabelFormat(value) {
    let scaledValue = value;

    return `${scaledValue} %`;
  }
  const [value, setValue] = useState(50);
  const [split, setSplit] = useState(50);

  const handleChange = (event, newValue) => {
    if (typeof newValue == 'number') {
      setValue(newValue);
      setSplit(newValue);
      console.log(split);
    }
  }

  const [alignment, setAlignment] = useState([0, 1, 2]);

  const handleAlignment = (event, newAlignment) => {
    // Check if the new alignment length is greater than 3
    if (newAlignment.length > 3) {
      // Remove the first (oldest) element from the selection
      newAlignment.shift();
    }
    // Update the state with the new alignment
    setAlignment(newAlignment);
  };

  const handleBack1 = () => {
    navigate("/review");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5",
        padding: "30px",
        width: "100%",
        // maxHeight: "100vh",
        // overflowY: "auto"
      }}
    >
      <Card
        sx={{
          padding: "20px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100%",
        }}
      >
        <Box sx={{ display: "flex" }} justifyContent="space-between">
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={handleBack1}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "600",
                fontFamily: "'SF Pro Display', sans-serif",
              }}
            >
              Model Training
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              fontFamily: "Open Sans",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={() => setOpenEdit(true)}
          >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={`/img/${type}.png`} alt={type} />
                <span style={{ marginLeft: "5px" }}>{name}</span>
              </div>
          </Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", gap: "2.5em" }}>
          <Box width="20%">
            <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{ height: "35em" }}>
              <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}>
              <Typography
               alignItems="center"
                sx={{
                  fontSize: { xl: "1.2rem", lg: "1.1rem", md: "1rem" },
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                  marginTop:"1.1em",
                  padding:"0em 0.3em 0em 1.8em"
                }}
              >
                Algorithm Selection
              </Typography>
              <HtmlTooltip
                placement="right" title="Use the best performing algorithm or choose one manually.">
                    <HelpIcon fontSize="small" sx={{ color: "#a3bbd4", marginTop:".9em" }} />
                </HtmlTooltip>
              </Box>
              
              <CustomTooltip
              open={tooltipId === 23 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>Opt for 'Auto' for the best performing algorithm
                    or 'Manual' to select your desired algorithm.</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(22)} >PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(24)} >NEXT</Button>
                  </Box>
                </Box>
              }
              placement="right"
              arrow
            >
              <Box>
              <ToggleButtonGroup
                value={isAuto}
                exclusive
                onChange={handleChecked}
                aria-label="text alignment"
                color="primary"
                style={{ width: '100%' }} // Add this line to make it full width
              >
                <ToggleButton value="Auto" style={{ width: '50%' }}>Auto</ToggleButton> {/* And adjust the width here */}
                <ToggleButton value="Manual" style={{ width: '50%' }}>Manual</ToggleButton> {/* And here */}
              </ToggleButtonGroup>
              </Box>
              </CustomTooltip>
              <TextField
                select
                fullWidth
                label="Select an algorithm"
                value={algoValue}
                onChange={handleAlgoChange}
                disabled={isAuto === "Auto" ? true : false}
              >
                {model && model.model_type === "RG"
                  ? regressionAlgos.map((algo) => (
                    <MenuItem key={algo.value} value={algo.value}>                      
                      <HtmlTooltip placement="right" title={algo.tooltip} sx={{fontFamily: "'SF Pro Display', sans-serif",}}> 
                      <Box sx={{width:"100%"}}>
                      <Typography sx={{fontFamily: "'SF Pro Display', sans-serif",}}>{algo.name}</Typography>   
                      </Box>                         
                      </HtmlTooltip>     
                    </MenuItem>
                  ))
                  : classificationAlgos.map((algo) => (
                    <MenuItem key={algo.value} value={algo.value}>
                      <HtmlTooltip placement="right" title={algo.tooltip} sx={{fontFamily: "'SF Pro Display', sans-serif",}}> 
                      <Box sx={{width:"100%"}}>
                      <Typography sx={{fontFamily: "'SF Pro Display', sans-serif",}}>{algo.name}</Typography>   
                      </Box>                         
                      </HtmlTooltip>     
                    </MenuItem>
                  ))}
              </TextField>   
              <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}>      
              <Typography
                sx={{
                  fontSize: { xl: "1.2rem", lg: "1.1rem", md: "1rem" },
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                  padding:"0em 0.3em 0em 1.6em"
                }}
              >
                Data Split Percentage
              </Typography>
              <HtmlTooltip
                placement="right" title="Decide percentage of data for training. The remainder will be used for testing. ">
                    <HelpIcon fontSize="small" sx={{ color: "#a3bbd4", }} />
                </HtmlTooltip>
              </Box>   
              <Typography
                id="non-linear-slider"
                width="100%"
                textAlign="center"
                style={{
                  border: "1px solid #2288FF",
                  borderRadius: "3px",
                  height:"3em",
                  padding:"1em",
                  paddingBottom:"2.4em",
                  fontFamily: "Open Sans",
                  fontWeight: "bold"

                }}
              >
                {valueLabelFormat(value)}
              </Typography>
              <CustomTooltip
              open={tooltipId === 24 || tooltipId === 25 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                tooltipId === 24 ? (
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"Define how you want to split your data for training and testing. A balanced split ensures a robust model performance."}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(23)} >PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(25)} >NEXT</Button>
                  </Box>
                </Box>
                ) : (
                  <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                    <Typography>{"Consider using a 70-30 or 80-20 split for your data. These are common ratios that offer a good balance between training and testing."}</Typography>
                    <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(24)}>PREVIOUS</Button>
                      <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(26)}>NEXT</Button>
                    </Box>
                  </Box>
                )
              }
              placement="right"
              arrow
            >
              <Box width="100%">
              <Slider
                value={split}                
                min={20}
                max={80}
                step={1}
                valueLabelFormat={valueLabelFormat}
                onChange={handleChange}
                // valueLabelDisplay="auto"
                aria-labelledby="non-linear-slider"
              />
              </Box>
              </CustomTooltip>
              {model.model_type === "RG" ?
                <>
                <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}>
                  <Typography
                    sx={{
                      fontSize: { xl: "1.2rem", lg: "1.1rem", md: "1rem" },
                      fontWeight: "bolder",
                      fontFamily: "'SF Pro Display', sans-serif",
                      padding:"0em 0.5em 0em 0.9em"
                    }}
                  >
                    Prediction Column Unit
                  </Typography>
                  <HtmlTooltip
                placement="right" title="Specify the Unit for the prediction column. Example: %, Dollars, years, Degree Celsius">
                    <HelpIcon fontSize="small" sx={{ color: "#a3bbd4", }} />
                </HtmlTooltip>
                  </Box>
                  <CustomTooltip
                    open={tooltipId === 26 ? true : false}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    title={
                      <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                        <Typography>Specify the unit for your prediction column. <br />
                            Example Units: years, cm, %, $.</Typography>
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(25)} >PREVIOUS</Button>
                          <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(27)} >NEXT</Button>
                        </Box>
                      </Box>
                    }
                    placement="right"
                    arrow
                  >
                    <Box sx={{width: "100%"}}>
                  <OutlinedInput
                    sx={{width: "100%",
                    padding:"0.8em"}}
                    placeholder="Unit for Prediction Column"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                  </Box>
                  </CustomTooltip>
                </> :
                <>
                <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}>
                  <Typography
                    sx={{
                      fontSize: { xl: "1.2rem", lg: "1.1rem", md: "1rem" },
                      fontWeight: "bolder",
                      fontFamily: "'SF Pro Display', sans-serif",
                      padding:"0em 0.5em 0em 0.9em"
                    }}
                  >
                    Prediction Column Label
                  </Typography>
                  <HtmlTooltip
                placement="right" title="Labels that represent 0 and 1 in the prediction column. Example: 0=Not Spam & 1=Spam, 0=Healthy & 1=Diseased ">
                    <HelpIcon fontSize="small" sx={{ color: "#a3bbd4", }} />
                </HtmlTooltip>
                  </Box>
                  <CustomTooltip
                    open={tooltipId === 26 ? true : false}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    title={
                      <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                        <Typography>{"Label the values that represent 0 and 1 in your prediction column."} <br /> {"Example Labels: 0=Not Spam & 1=Spam, 0=Healthy & 1=Diseased "}</Typography>
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(25)} >PREVIOUS</Button>
                          <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(27)} >NEXT</Button>
                        </Box>
                      </Box>
                    }
                    placement="right"
                    arrow
                  >
                    <Box sx={{width: "100%"}}>
                  <OutlinedInput
                  value={label0}
                  onChange={(e) => setLabel0(e.target.value)}
                    sx={{width: "100%",
                          padding:"0.8em",
                          marginBottom: "1em"}}
                    placeholder="Label for Value 0"
                  />
                  
                  
                  <OutlinedInput
                  value={label1}
                  onChange={(e) => setLabel1(e.target.value)}
                    sx={{width: "100%",
                          padding:"0.8em"}}
                    placeholder="Label for Value 1"
                  />
                  </Box>
                  </CustomTooltip>                  
                </>}
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box width="40%">
            <Box sx={{ height: "5em" }}>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                  marginTop:"1.1em"
                }}
              >
                Column Mapping
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}
              >
                Drag and drop the columns to the respective boards
              </Typography>
            </Box>
            <Lists
              columns={columns}
              elements={elements}
              setElements={setElements}
              tooltipId={tooltipId}
              setTooltipId={setTooltipId}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box width="40%">
            <Box sx={{ height: "5em" }}>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                  marginTop:"1.1em"
                }}
              >
                Data Viewer
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}
              >
                Click on the column boxes to peek into your data
              </Typography>
            </Box>
            <CustomTooltip
              open={tooltipId === 32 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>Get a quick glance at your data. Click on the columns and review the top rows of your 
                        dataset to ensure correct column mapping.</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(31)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(33)}>NEXT</Button>
                  </Box>
                </Box>
              }
              placement="left"
              arrow
            >
             <Box width="100%" sx={{marginTop:"0.3em", marginBottom:"0.3em"}}>
                <Box sx={{
                    height: '150px',  // Fixed height
                    overflowY: 'auto',  // Enable vertical scrolling
                    // Hide scrollbar
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}>
                    <ToggleButtonGroup value={alignment} onChange={handleAlignment}
                                        aria-label="text alignment" color="primary"
                                        style={{display: "flex", flexWrap: "wrap"}}>
                        {
                            response.columns.map((item, index) =>
                                <ToggleButton key={index} style={{
                                    margin: "5px",
                                    border: "1px solid",
                                    borderRadius: "5px",
                                    padding: "5px",
                                    fontFamily: "'SF Pro Display', sans-serif",                                                
                                }}
                                sx = {{fontSize: {xl: "0.9rem", lg: "0.8rem", md: "0.7rem"},}}
                                value={index}>{item}</ToggleButton>
                            )
                        }
                    </ToggleButtonGroup>
                </Box>
            </Box>
            </CustomTooltip>
            <Box overflow="auto">
            <Table width="100%">
            <TableHead width="100%" style={{ backgroundColor: "#EEEEEE"}}>
              <tr> {/* Add this <tr> tag to wrap your <TableCell> tags */}
                {alignment.map((one, index) =>
                  <th key={one}> {/* Use <th> for header cells */}
                    <Typography fontSize="1.2em" style={{ width: "fit-content", fontFamily: "'SF Pro Display', sans-serif", fontWeight:"800", padding:"5px"}}>
                      {response.columns[one]}
                    </Typography>
                  </th>
                )}
              </tr> {/* Close the <tr> tag here */}
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) =>
                <TableRow key={`row-${rowIndex}`}>
                  {alignment.map((one, cellIndex) =>
                    <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                      {response.histogram[response.columns[one]][row]}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>


            </Box>
          </Box>
        </Box>        
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
        <CustomTooltip
              open={tooltipId === 33 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"Once you are done with column mapping and adding the unit/labels for the prediction, click on 'Train Model' "}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(32)}>PREVIOUS</Button>
                    <Button variant="contained" onClick={() => setTooltipId(34)}>OKAY</Button>
                    {/* <Button variant="contained"  onClick={() => dispatch({ type: "TOGGLE_MODE", payload: -1 })}>OKAY</Button> */}
                  </Box>
                </Box>
              }
              placement="left"
              arrow
            >
              <Box>
          <Button variant="contained" disabled={disabled} sx={{ borderRadius: "15px" }} onClick={onClick}>
            Train Model
          </Button>
          </Box>
          </CustomTooltip>
        </Box>        
      </Card>
      <LoadingDialog
        open={loadingOpen}
        setOpen={setLoadingOpen}
      />
      <EditDialog open={openEdit} setOpen={setOpenEdit} modelName={name} />
      <TutorialComponent
        tutorialData={currentTutorialData}
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        conceptName={
          currentTutorialData === mlTutorialData ? "Machine Learning" :
          currentTutorialData === dataBasicsTutorialData ? "Data Basics" :
          currentTutorialData === dataPreprocessingTutorialData ? "Data Preprocessing" :
          "Model Training"
        }
      />
      <QuizDialog
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        questions={currentQuizQuestions}
        onComplete={handleQuizComplete}
        onRedo={handleQuizRedo}
        conceptName={
          currentQuizQuestions === mlQuizQuestions ? "Machine Learning" :
          currentQuizQuestions === dataBasicsQuizQuestions ? "Data Basics" :
          currentQuizQuestions === dataPreprocessingQuizQuestions ? "Data Preprocessing" :
          "Model Training"
        }
      />
      <EducationalFAB 
        open={fabOpen}
        onToggle={handleFabToggle}
        tasks={fabTasks}
        onTaskStart={handleTaskStart}
        onTaskComplete={handleTaskComplete}
        progress={learningProgress}
        onQuizRedo={handleQuizRedo}
        currentPage="select"
        sx={{ zIndex: 1300 }}
      />
    </Box>
  );
};

export default Body;
