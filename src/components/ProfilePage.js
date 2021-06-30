import React, {useState, useEffect} from "react";
import axios from "axios";
import {useForm} from 'react-hook-form';
import styles from "./Components.module.css"
import jwt_decode from "jwt-decode";


function ProfilePage() {


    const {handleSubmit} = useForm();
    const [message, setMessage] = useState();
    const [allImages, setAllImages] = useState([]);
    const [length, setLength] = useState(0);
    const [fileName, setFileName] = useState();
    const [fileUrl, setFileUrl] = useState()
    const [fileID, setFileID] = useState()
    const [showFileFromKeepName, setShowFileFromKeepName] = useState(false)
    const [fileToUpload, setFileToUpload] = useState();
    const [nameFileToUpload, setNameFileToUpload] = useState()
    const [updateFiles, setupdateFiles] = useState(false)
    const [changeProfileData, setChangeProfileData] = useState(false)


    // *******************UseEffect********************


    useEffect(() => {
        getFilesFromBackend()


        // setupdateFiles(true)
    }, []);

    //
    useEffect(() => {
        console.log("UseEffect updateFiles")
        if (updateFiles) {
            getFilesFromBackend()
            setupdateFiles(false)
        }

    }, [updateFiles]);




    // ***********************************************************

    function keepName(file) {

        console.log("file in keepName: ", file)

        setFileName(file.name)
        setFileUrl(file.url);
        setFileID(file.id);
        setShowFileFromKeepName(true)

    }

    // ***********************************************************

    async function deletePicture() {
        setFileUrl("")
        setShowFileFromKeepName(false)
        console.log("FILE ID:", fileID)
        try {

            const response = await axios.delete(`http://localhost:8080/file/files/${fileID}`, {
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${jwtToken}`, /*BACK TICK!!!!!*/
                }
            })
            setupdateFiles(true)

            console.log("PLAATJE WEG")


        } catch (error) {
            console.log("PLAATJE NIET WEG")
        }

    }


    async function getFilesFromBackend() {

        try {
            console.log("IN getFilesFromBackend")

            const response = await axios.get("http://localhost:8080/file/files")


            setMessage("Files goed opgehaald uit de backend")
            setLength(response.data.length);
            setAllImages(response.data);
            setFileID(response.data[0].id)


        } catch (e) {
            setMessage("Upload Fout")
            console.log("Er is iets fout gegaan bij het ophalen")
        }


    }


    async function sendFileToBackend() {

        console.log("IN sendFileToBackend() ")
        console.log("NameFileToUpload: ", nameFileToUpload)
        console.log("FileToUpload: ", fileToUpload)


        try {
            let formData = new FormData()

            console.log("TRY fileToUpload:", fileToUpload)

            // LET OP!!!! name: "file"  DIT MOET DUS "file" blijven
            formData.append("file", fileToUpload);

            console.log("FormData:", formData)


            const response = await axios.post("http://localhost:8080/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",

                    "Content-type": "application/json",

                },
            });

            setupdateFiles(true)
            console.log("response", response)
        } catch (error) {

            console.log("Foutje bij het versturen naar backend")


        }

    }

    function updateDataProfile() {
        setChangeProfileData(true)
    }

    function sendImageToBackend() {
        sendFileToBackend()

    }


    function onSubmit() {

        console.log("IN onSubmit")
        console.log("NameFileToUpload: ", nameFileToUpload)
        console.log("FileToUpload: ", fileToUpload)
        sendFileToBackend();
    }


    return (


        <>
            <div className={styles.container}>

                {/*************  LEFT COlUMN   ***********/}

                <div className={styles.item1}>Lorem ipsum dolor sit amet.
                    nog meer text
                    Naam: Robbie
                    <button
                        className={styles.button1}
                        onClick={updateDataProfile}
                    >
                        verander gegevens</button>


                </div>


                {/*************  CENTER COLUMN   ***********/}


                <div className={styles.containertest}>

                    {allImages.length > 0 &&
                    <img
                        className={styles.image}
                        alt={"Eerste file in fileinfos"}
                        src={allImages[0].url}
                    />
                    }


                    {allImages.length === 0 &&
                    <div>
                        <form
                            className={styles.onSubmit}
                            onSubmit={handleSubmit(onSubmit)}>

                            <input

                                type="file"
                                accept="image/*"
                                onChange={(e) => setFileToUpload(e.target.files[0])}
                            />


                            <button
                                type="submit"

                            >
                                SAVE!
                            </button>
                        </form>


                    </div>
                    }

                    {allImages.length > 0 &&
                    <button
                        onClick={deletePicture}
                    >
                        delete plaatje
                    </button>
                    }

                </div>


                {/*************  RIGHT COLUMN   ***********/}

                {changeProfileData &&

                <div className={styles.item2}>

                    <div>

                        <div>Lorem ipsum dolor sit amet.</div>
                        <div>Naam:</div>
                        <div>email:</div>
                    </div>

                    <div>

                        <button className={styles.button2}>Update!</button>

                        <button className={styles.button2}>cancel</button>


                    </div>


                </div>
                }


            </div>


            {/*    <div className={styles.container}>*/}
            {/*        <div className={styles.item}>Lorem ipsum dolor sit amet.</div>*/}


            {/*        {allImages.length > 0 &&*/}


            {/*        <div>*/}


            {/*            <div className={styles.containerPlaatje}>*/}


            {/*                <img*/}
            {/*                    className={styles.plaatje}*/}
            {/*                    alt={"Eerste file in fileinfos"}*/}
            {/*                    src={allImages[0].url}*/}
            {/*                />*/}


            {/*            </div>*/}
            {/*            <span>*/}
            {/*                    <button>*/}
            {/*                        klik mij*/}

            {/*                    </button>*/}

            {/*                </span>*/}

            {/*        </div>*/}
            {/*        }*/}


            {/*        <div className={styles.item}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque eaque eius*/}
            {/*            et*/}
            {/*            nesciunt non quasi, quia ratione recusandae ut voluptas.*/}
            {/*        </div>*/}

            {/*        <div className={styles.item}>Lorem ipsum dolor sit amet.</div>*/}
            {/*        <div className={styles.item}>Lorem ipsum dolor sit amet.</div>*/}
            {/*    </div>*/}

        </>

    )


}


export default ProfilePage;
