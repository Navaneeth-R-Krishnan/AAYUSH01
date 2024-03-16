import React, {useState} from 'react';
import {
    AppBar,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import logo from "./img/logo-png.png";
import person from "./img/person.png";
import {openAIRequest} from "./api";

const App = () => {
    const [state, setState] = useState({text: "", region: "", appellate: 0, response: "", usage: "", processing: false})

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, [e.target.name]: e.target.value})

    }
    const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setState(s => ({...s, appellate: 1}))
        } else {
            setState(s => ({...s, appellate: 0}))
        }
    }
    const onSubmit = () => {
        setState(prevState => ({...prevState, response: ""}));
        setState(prevState => ({...prevState, usage: ""}));
        let request, appellate_phrase, extractedJSON: string;
        const disclaimer = 'Try to give no disclaimer/advise to consult lawyers as I anyway will. I just need casual info.'
        // if appellate checked
        if (state.appellate) {
            appellate_phrase = ", appellate:''}"
        } else {
            appellate_phrase = "}"
        }
        if (state.region === "") {
            request = "I'm from India and " + state.text + ". Give output in json in this format {intro:'', references:'', precedents:'', suggested:''" + appellate_phrase + disclaimer;
        } else {
            request = "I'm from " + state.region + " and " + state.text + ". Give output in json in this format {intro:'', references:'', precedents:'', suggested:''" + appellate_phrase + disclaimer;
        }
        setState(prevState => ({...prevState, processing: true}));
        openAIRequest(request)
            .then(response => {
                if (response) {
                    const content = response.data.choices[0].message.content;
                    const jsonMatch = content.match(/{[\s\S]*}/);
                    if (jsonMatch) {
                        extractedJSON = jsonMatch[0];
                    } else {
                        extractedJSON = ("");
                    }
                    const usage = response.data.choices.usage;
                    setState(prevState => ({...prevState, response: extractedJSON}));
                    setState(prevState => ({...prevState, usage: usage}));
                }
                setState(prevState => ({...prevState, processing: false}));
            })
            .catch(error => {
                console.error(error);
                setState(prevState => ({...prevState, processing: false}));
            })
            .finally(() => {
                setState(prevState => ({...prevState, processing: false}));
            });
    }

    return (<>
            <Paper sx={{background: `url(${logo})`,
                backgroundSize: '50%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',}}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container alignItems={"center"} justifyContent={"center"} direction={"row"}>
                            <Typography variant="h6">AAYUSH - Medical Insights</Typography>

                        </Grid>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="sm" style={{marginTop: 20, marginBottom: 20}}>

                    <Card sx={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: 8,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        marginTop: 1, marginBottom: 1
                    }}>
                        <CardContent>
                            <Grid container direction={"column"} gap={1} justifyContent={"space-between"}>
                                <Grid>
                                    <Typography><center><i>Your Instant Health Advisor, AAYUSH - Your Wellness Partner is here for you</i> :).</center> <br/> <br/>
                                    Whether you're looking to manage a chronic condition or seeking tips for maintaining overall well-being, Aayush is here to support you every step of the way. Just ask</Typography>
                                    <Typography><i></i></Typography>
                                </Grid>
                                <Grid alignSelf={"center"}>
                                    <center><img src={person} alt="LegAlly's Lawyer" style={{width: '30%', marginBottom: 10}}/>
                                    </center>
                                </Grid>
                                <TextField label="Which City, State/Territory are you from?" fullWidth
                                           value={state.region}
                                           name={"region"} onChange={onChange}/>
                                <TextField label="Enter your query" fullWidth value={state.text} name={"text"}
                                           onChange={onChange}/>
                                <FormControlLabel
                                    control={<Checkbox onChange={onCheck}
                                                       checked={state.appellate as unknown as boolean}/>}
                                    label={"Do you want the details of the Appellate Authority?"}/>
                                <Grid alignSelf={"flex-end"}>
                                    <Button variant={"contained"} onClick={onSubmit}>Submit</Button>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: 8,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        marginTop: 1, marginBottom: 1
                    }}>
                        <CardContent>
                            <Grid minWidth="sm" style={{marginTop: 20, marginBottom: 20}}>
                                <Typography visibility={state.processing ? "visible" : "hidden"}><i>Please wait while we
                                    generate a personalized advice</i></Typography>
                                <Grid container direction={"row"} gap={4}
                                      visibility={state.response !== "" ? "visible" : "hidden"}>
                                    <Typography
                                        style={{whiteSpace: 'pre-line'}}>{state.response === "" ? "" : JSON.parse(state.response)?.intro || ""}</Typography>
                                    <Grid>
                                        <Typography fontSize={25}> Medical References</Typography>
                                        <Typography
                                            style={{whiteSpace: 'pre-line'}}>{state.response === "" ? "" : JSON.parse(state.response)?.references || ""}</Typography>

                                    </Grid>
                                    <Grid>
                                        <Typography fontSize={25}> Precedents</Typography>
                                        <Typography
                                            style={{whiteSpace: 'pre-line'}}>{state.response === "" ? "" : JSON.parse(state.response)?.precedents || ""}</Typography>

                                    </Grid>
                                    <Grid
                                        visibility={state.response === "" ? "hidden" : (JSON.parse(state.response).suggested as string === "" ? "hidden" : "visible")}>
                                        <Typography fontSize={25}>Suggested Course/Actions</Typography>
                                        <Typography
                                            style={{whiteSpace: 'pre-line'}}>{state.response === "" ? "" : JSON.parse(state.response)?.suggested || ""}</Typography>
                                    </Grid>
                                    <Grid
                                        visibility={state.response === "" ? "hidden" : (JSON.parse(state.response).appellate as string === "" ? "hidden" : (state.appellate ? "visible": "hidden"))}>
                                        <Typography fontSize={25}>Appellate Authority</Typography>
                                        <Typography
                                            style={{whiteSpace: 'pre-line'}}>{state.response === "" ? "" : (JSON.parse(state.response).appellate as string === "" ? "" : JSON.parse(state.response)?.appellate || "")}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid alignSelf={"flex-end"}>
                        <Typography fontSize={10}><b>Disclaimer</b>: <br/>The data provided is generated using AI. HelpMe
                            is not
                            responsible for the authenticity or accuracy of the data. <br/>
                            Data provided here not to be considered as medical advice. HelpMe is not a replacement to a doctor. <br/>
                            Data provided is updated until September 2021. <br/>
                            <center>© HelpMe, All rights reserved.</center>
                        </Typography>
                    </Grid>
                </Container>
            </Paper>
    </>);
};

export default App;
