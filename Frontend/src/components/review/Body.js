import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Tooltip,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "./Table";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { saveDescription } from "../../actions/modelAction";
import { useState } from "react";
import Chart from "./Chart";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { tooltipClasses } from '@mui/material/Tooltip';
import "../../App.css";
import EditDialog from "../common/EditDialog";
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid";
import { useEffect } from "react";
import { withStyles } from "@mui/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TutorialComponent from "../common/TutorialComponent";
import QuizDialog from "../common/QuizDialog";
import EducationalFAB from "../common/Fab";
import rg from "../../static/images/rg.gif";
import ml from "../../static/images/Home Page.gif";
import ml2 from "../../static/images/howitwork.gif";
import ml3 from "../../static/images/typeofml.gif";
import sl from "../../static/images/supervisedl.gif";
import cl from "../../static/images/cl.gif";
import im from "../../static/images/Import Page.gif";
import dts from "../../static/images/dataset.gif";
import idpd from "../../static/images/independent.gif";
import p1 from "../../static/images/Preprocessing1.gif";
import p2 from "../../static/images/Preprocessing2.gif";
import p3 from "../../static/images/Preprocessing3.gif";
import p4 from "../../static/images/Preprocessing4.gif";
import p5 from "../../static/images/Preprocessing5.gif";
import p6 from "../../static/images/Preprocessing6.png";
import p7 from "../../static/images/Preprocessing7.png";
import p8 from "../../static/images/Preprocessing8.gif";
import p9 from "../../static/images/Preprocessing9.gif";
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

const Body = ({ backDialogOpen, setBackDialogOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(state => state.tasks);
  const learningProgress = useSelector(state => state.learningProgress);

  const { name, type, isLoading, response, histogram, mode } = useSelector(
    (state) => state.model
  );

  const [descrip, setDescrip] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [tooltipId, setTooltipId] = useState(0);

  // FAB state management
  const [fabOpen, setFabOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTutorialData, setCurrentTutorialData] = useState(dataPreprocessingTutorialData);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState(dataPreprocessingQuizQuestions);

  useEffect(() => {
    if (response) {
      const columnsArray = [];
      response.columns.map(key =>
        columnsArray.push({
          field: String(key),
          headerName: String(key),
          sortable: false,
          editable: true,
          tooltipClasses: "none"
        })
      )

      columnsArray.push({
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      });

      setColumns(columnsArray);
    }
  }, [response, rowModesModel]);

  useEffect(() => {
    if (histogram) {
      const keys = Object.keys(histogram);

      const convertedData = histogram[keys[0]].map((_, index) => {
        const newObj = {};
        keys.forEach(key => {
          newObj[key] = histogram[key][index];
        })
        newObj['id'] = String(index);
        return newObj;
      })

      setValues(convertedData);
    }
  }, [histogram]);

  useEffect(() => {
    setTooltipId(mode);
    console.log("Review Mode:",mode);
    console.log("Review TooltipID:",tooltipId);
  }, [mode]);

  useEffect(() => {
    console.log("Review dispatch",tooltipId);
    if (tooltipId === 15 || tooltipId === 23) dispatch({ type: "TOGGLE_MODE", payload: tooltipId });
    console.log("After Dispatch Mode:",mode);
    console.log("After Dispatch TooltipID:",tooltipId);
  }, [tooltipId])

  const handleOpen = () => { };

  const handleClose = () => { };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setValues(values.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = values.find((row) => row.id === id);
    if (editedRow.isNew) {
      setValues(values.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setValues(values.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleBack = () => {
    setBackDialogOpen(true);
  };
  const onClick = () => {
    dispatch(saveDescription(descrip));
    navigate("/select");
  };

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

  return isLoading ? (
    <Backdrop className="main"
      sx={{ padding: "30px", backgroundColor: "#F5F5F5", zIndex: (theme) => theme.zIndex.drawer + 1, position: "inherit", gap: "1em" }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
      <Typography fontSize="1.5em" fontWeight="bold">Analysing...</Typography>
    </Backdrop>
  ) : (
    <Card className="main"
      sx={{
        flex: 1,
        backgroundColor: "#F5F5F5",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "30px",
      }}
    // sx={{
    //   display: "flex",
    //   flexDirection: "column",
    //   gap: "2.5em",
    //   flex: "1",
    //   margin: "2em",
    //   padding: "2em",
    //   borderRadius: "20px",
    // }}
    >
      <Paper sx={{ width: "100%", padding: "20px", borderRadius: "20px" }}>
        <Box sx={{ display: "flex" }} justifyContent="space-between">
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={handleBack} sx={{ marginTop: "-12px" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
                fontFamily: "'SF Pro Display', sans-serif",
                marginBottom: "15px"
              }}
            >
              Preprocessing
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              fontFamily: "'SF Pro Display', sans-serif",
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
        <Box
          sx={{
            display: "flex",
            gap: "2.5em",
            marginTop: "0.5em"
          }}
        >
          <Box sx={{ width: "15em" }}>
            <Box
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                margin: "0 0 1.5em 0",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                File Fitness
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Ensure all the boxes below are green
              </Typography>
            </Box>
            {/* {response && response.fileFitForUse ? ( */}
              <Alert severity="success" sx={{ margin: "1em 0" }}>
                File is fit for predictions.
              </Alert>
            {/* ) : (
              <Alert severity="error" sx={{ margin: "1em 0" }}>
                File is not fit for predictions.
              </Alert>
            )} */}

            <CustomTooltip
              open={tooltipId === 15 ? true : false}
              onOpen={handleOpen}
              onClose={handleClose}
              title={
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>At a glance, check if your file is ready for predictions. Ensure
                    all boxes are green for the best outcomes!</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(14)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(16)}>NEXT</Button>
                  </Box>
                </Box>
              }
              placement="right"
              arrow
            >
              <Box>
                <CustomTooltip
                  open={tooltipId === 16 ? true : false}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  title={
                    <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                      <Typography>
                        {"Quickly view the size of your dataset (rows). Remember, more data often means better model accuracy."}</Typography>
                      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(15)}>PREVIOUS</Button>
                        <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(17)}>NEXT</Button>
                      </Box>
                    </Box>
                  }
                  placement="right"
                  arrow
                >
                  <Box>
                    <HtmlTooltip placement="right"
                      title={
                        <React.Fragment>
                          <b>{" There should be 30 times as many rows as there are columns. "}</b>
                        </React.Fragment>}>

                        {response && response.rows ? (
                        <Alert
                          icon={<CheckIcon fontSize="inherit" />}
                          sx={{ margin: "1em 0" }}
                          severity="success"
                        >
                          Total Rows: {response.rows}
                        </Alert>
                      ) : (
                        ""
                      )}
                      {/* {response && response.rows ? (
                        <Alert
                          icon={
                            response.rows < response.columnsLength * 30 ? (
                              <CloseIcon fontSize="inherit" />
                            ) : (
                              <CheckIcon fontSize="inherit" />
                            )
                          }
                          sx={{ margin: "1em 0" }}
                          severity={
                            response.rows < response.columnsLength * 30
                              ? "error"
                              : "success"
                          }
                        >
                          Total Rows: {response.rows}
                        </Alert>
                      ) : (
                        ""
                      )} */}
                    </HtmlTooltip>

                    <HtmlTooltip placement="right"
                      title={
                        <React.Fragment>
                          <b>{" There must be at least 2 columns in the dataset "}</b>
                        </React.Fragment>}>

                      {response && response.columnsLength ? (
                        <Alert
                          icon={<CheckIcon fontSize="inherit" />}
                          sx={{ margin: "1em 0" }}
                          severity="success"
                        >
                          Total Columns: {response.columnsLength}
                        </Alert>
                      ) : (
                        ""
                      )}
                    </HtmlTooltip>
                  </Box>
                </CustomTooltip>


                <HtmlTooltip placement="right"
                  title={
                    <React.Fragment>
                      <b>{" Amount of rows that contain empty values "}</b>
                    </React.Fragment>}>
                  {response ? (
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      sx={{ margin: "1em 0" }}
                      severity="success"
                    >
                      Unfit Rows: {response.unfitRows}
                    </Alert>
                  ) : (
                    ""
                  )}
                </HtmlTooltip>

                <HtmlTooltip placement="right"
                  title={
                    <React.Fragment>
                      <b>{" Amount of columns that are empty "}</b>
                    </React.Fragment>}>
                  {response ? (
                    <Alert
                      icon={<CheckIcon fontSize="inherit" />}
                      sx={{ margin: "1em 0" }}
                      severity="success"
                    >
                      Unfit Columns: {response.unfitColumns}
                    </Alert>
                  ) : (
                    ""
                  )}
                </HtmlTooltip>
              </Box>
            </CustomTooltip>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                fontFamily: "'SF Pro Display', sans-serif",
                margin: "0 0 1.5em 0",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: "bolder",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Columns
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontFamily: "'SF Pro Display', sans-serif",
                }}>
                Review data for missing values and assess column fitness
              </Typography>
            </Box>
            <TableComponent descrip={descrip} setDescrip={setDescrip} tooltipId={tooltipId} setTooltipId={setTooltipId} />
          </Box>
        </Box>
      
        <Box sx={{ flex: 1, marginTop: '2em' }}>
          <Box
            sx={{
              fontFamily: "'SF Pro Display', sans-serif",
              margin: "0 0 1.5em 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Data Quality
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Inspect dataset statistics and check the Alerts section
            </Typography>
          </Box>
          {/* <TableComponent descrip={descrip} setDescrip={setDescrip} /> */}
          <CustomTooltip
            open={tooltipId === 19 || tooltipId === 20 ? true : false}
            onOpen={handleOpen}
            onClose={handleClose}
            title={
              tooltipId === 19 ? (
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"A sneak peek at your dataset's characteristics. Spot missing cells, duplicate rows, and more."}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(18)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(20)}>NEXT</Button>
                  </Box>
                </Box>
              ) : (
                <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                  <Typography>{"Click on the Alerts section to inspect the dataset in detail. Consider removing columns with more than 50% zeros or empty values"}</Typography>
                  <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(19)}>PREVIOUS</Button>
                    <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(21)}>NEXT</Button>
                  </Box>
                </Box>
              )
            }
            placement="top"
            arrow
          >
            <iframe
              id="iframe-id"
              width="100%"
              height="700px"
              srcDoc={response.profile}
              frameBorder="0"
            />
          </CustomTooltip>
        </Box>

        <Box sx={{ flex: 1, marginTop: '2em' }}>
          <Box
            sx={{
              fontFamily: "'SF Pro Display', sans-serif",
              margin: "0 0 1.5em 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.6rem",
                fontWeight: "bolder",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Data Editor
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontFamily: "'SF Pro Display', sans-serif",
              }}>
              Explore, handle missing rows and prepare your dataset
            </Typography>
          </Box>
          <CustomTooltip
            open={tooltipId === 21 ? true : false}
            onOpen={handleOpen}
            onClose={handleClose}
            title={
              <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                <Typography>{"Tailor your raw data here. While VisAutoML handles major adjustments, you can fine-tune column names, data formats, and specific values for precision."}</Typography>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(20)}>PREVIOUS</Button>
                  <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(22)}>NEXT</Button>
                </Box>
              </Box>
            }
            placement="top"
            arrow
          >
            <Box
              sx={{
                height: '600px',
                width: '100%',
                '& .actions': {
                  color: 'text.secondary',
                },
                '& .textPrimary': {
                  color: 'text.primary',
                },
              }}
            >
              <DataGrid
                rows={values}
                columns={columns}
                editMode="row"
                disableColumnMenu={true}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
              />
            </Box>
          </CustomTooltip>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "end", margin: "1em 0 0 0" }}>
          <CustomTooltip
            open={tooltipId === 22 ? true : false}
            onOpen={handleOpen}
            onClose={handleClose}
            title={
              <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                <Typography>{"By clicking 'Process Data', the system will automatically impute missing data using the mean, remove duplicate values, and address outliers for you."}</Typography>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(21)}>PREVIOUS</Button>
                  <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(23)}>OKAY</Button>
                </Box>
              </Box>
            }
            placement="top-start"
            arrow
          >
            <Button
              variant="contained"
              sx={{ borderRadius: "15px" }}
              onClick={onClick}
            >
              Process Data
            </Button>
          </CustomTooltip>
        </Box>
      </Paper>
      <EditDialog open={openEdit} setOpen={setOpenEdit} modelName={name} />
      <TutorialComponent
        tutorialData={currentTutorialData}
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
        conceptName={
          currentTutorialData === mlTutorialData ? "Machine Learning" :
          currentTutorialData === dataBasicsTutorialData ? "Data Basics" :
          "Data Preprocessing"
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
          "Data Preprocessing"
        }
      />
      <EducationalFAB
        open={fabOpen}
        onToggle={handleFabToggle}
        tasks={tasks}
        onTaskStart={handleTaskStart}
        onTaskComplete={handleTaskComplete}
        progress={learningProgress}
        onQuizRedo={handleQuizRedo}
        currentPage="review"
        sx={{ zIndex: 1300 }}
      />
    </Card>
  );
};

export default Body;
