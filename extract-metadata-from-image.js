import React, { Component } from "react";
import EXIF from "exif-js";

export default class ExampleDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialStageMetaData: undefined,
            metaLoading: false,
            notFoundMsg1: "",
            gpsNotFoundMsg1: "",
            is_lat: "",
            is_long: ""
        };

    }

    getImageDetails = async id => {
        this.setState({
            metaLoading: true,
            notFoundMsg1: "",
            gpsNotFoundMsg1: ""
            is_lat: "",
            is_long: "",
            initialStageMetaData: undefined,
        });
        var result;
        var msg;
        var gpsMsg;
        var latitude;
        var longitude;
        var file = document.getElementById(id);
        await EXIF.getData(file, async function() {
            var exifData = await EXIF.getAllTags(this);
            if (exifData && Object.keys(exifData).length !== 0) {
                result = exifData;
                msg = "";
                var aLat = EXIF.getTag(this, "GPSLatitude");
                var aLong = EXIF.getTag(this, "GPSLongitude");

                if (!(aLat && aLong)) {
                    console.log("GPS info not found");
                    gpsMsg = translate("gps_info_not_found");
                } else {
                    gpsMsg = "";
                    // convert from deg/min/sec to decimal for Google
                    var strLatRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
                    var strLongRef =
                        EXIF.getTag(this, "GPSLongitudeRef") || "W";
                    var fLat =
                        (aLat[0] + aLat[1] / 60 + aLat[2] / 3600) *
                        (strLatRef == "N" ? 1 : -1);
                    var fLong =
                        (aLong[0] + aLong[1] / 60 + aLong[2] / 3600) *
                        (strLongRef == "W" ? -1 : 1);

                    latitude = fLat;
                    longitude = fLong;
                }
            } else {
                result = undefined;
                msg = translate("no_metadata_found_in_image");
            }
        });

        setTimeout(() => {
            if (id === "initial_stage") {
                this.setState({
                    initialStageMetaData: result,
                    metaLoading: false,
                    notFoundMsg1: msg,
                    gpsNotFoundMsg1: gpsMsg,
                    is_lat: latitude,
                    is_long: longitude
                });
            }
            if (id === "execution_stage") {
                this.setState({
                    executionStageMetaData: result,
                    metaLoading: false,
                    notFoundMsg2: msg,
                    gpsNotFoundMsg2: gpsMsg,
                    es_lat: latitude,
                    es_long: longitude
                });
            }
            if (id === "final_stage") {
                this.setState({
                    finalStageMetaData: result,
                    metaLoading: false,
                    notFoundMsg3: msg,
                    gpsNotFoundMsg3: gpsMsg,
                    fs_lat: latitude,
                    fs_long: longitude
                });
            }
        }, 3000);
    };

    render() {
        return (
            <>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <div className="container">
                        {this.state.details &&
                        this.state.details.id &&
                        !this.state.loading ? (
                            <a className="navbar-brand" href="#">
                                (#{this.state.details.project_id}){" "}
                                {translate("project_details")} -{" "}
                                {this.state.rn_loading && "Loading..."}
                                {this.state.region_name},{" "}
                                {this.state.community_name}
                            </a>
                        ) : (
                            <a className="navbar-brand" href="/">
                                {translate("project_details")}
                            </a>
                        )}

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarsExampleDefault"
                            aria-controls="navbarsExampleDefault"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div
                            className="collapse navbar-collapse"
                            id="navbarsExampleDefault"
                        >
                            <ul className="navbar-nav mr-auto"></ul>
                            <form className="form-inline my-2 my-lg-0">
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/">
                                            {translate("home")}
                                        </a>
                                    </li>
                                    <li className="nav-item active">
                                        <a
                                            className="nav-link"
                                            href="/projects"
                                        >
                                            {translate("projects")}
                                        </a>
                                    </li>
                                    <li className="nav-item active">
                                        <a
                                            className="nav-link"
                                            href="/statistics"
                                        >
                                            {translate("statistics")}
                                        </a>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </div>
                </nav>
                <main role="main" className="container">
                    {this.state.loading ? (
                        <div className="text-center">
                            <div className="spinner-border m-5" role="status">
                                <span className="sr-only">
                                    {translate("loading")}...
                                </span>
                            </div>
                        </div>
                    ) : this.state.details && this.state.details.id ? (
                        <div>
                            <nav>
                                <div
                                    className="nav nav-tabs"
                                    id="nav-tab"
                                    role="tablist"
                                >
                                    <a
                                        className="nav-item nav-link active"
                                        id="nav-0-tab"
                                        data-toggle="tab"
                                        href="#nav-0"
                                        role="tab"
                                        aria-controls="nav-0"
                                        aria-selected="true"
                                    >
                                        {translate("details")}
                                    </a>
                                    {/* <a
                                        className="nav-item nav-link"
                                        id="nav-1-tab"
                                        data-toggle="tab"
                                        href="#nav-1"
                                        role="tab"
                                        aria-controls="nav-1"
                                        aria-selected="true"
                                    >
                                        Activity Plan
                                    </a>
                                    <a
                                        className="nav-item nav-link"
                                        id="nav-2-tab"
                                        data-toggle="tab"
                                        href="#nav-2"
                                        role="tab"
                                        aria-controls="nav-2"
                                        aria-selected="false"
                                    >
                                        Technical Design plan
                                    </a> */}
                                    <a
                                        className="nav-item nav-link"
                                        id="nav-3-tab"
                                        data-toggle="tab"
                                        href="#nav-3"
                                        role="tab"
                                        aria-controls="nav-3"
                                        aria-selected="false"
                                    >
                                        {translate("initial_stage")}
                                    </a>
                                    <a
                                        className="nav-item nav-link"
                                        id="nav-4-tab"
                                        data-toggle="tab"
                                        href="#nav-4"
                                        role="tab"
                                        aria-controls="nav-4"
                                        aria-selected="false"
                                    >
                                        {translate("execution_stage")}
                                    </a>
                                    <a
                                        className="nav-item nav-link"
                                        id="nav-5-tab"
                                        data-toggle="tab"
                                        href="#nav-5"
                                        role="tab"
                                        aria-controls="nav-5"
                                        aria-selected="false"
                                    >
                                        {translate("final_stage")}
                                    </a>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-0"
                                    role="tabpanel"
                                    aria-labelledby="nav-0-tab"
                                >
                                    <div
                                        className="container row"
                                        style={{ paddingTop: 30 }}
                                    >
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate(
                                                        "type_of_Project"
                                                    )}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={
                                                        this.state.pti_loading
                                                            ? translate(
                                                                  "loading"
                                                              ) + "..."
                                                            : translate(
                                                                  this.state
                                                                      .project_type_name
                                                              ) || ""
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate("project")} ID
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .project_id || ""
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate("year")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .year || ""
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate("activity_plan")}
                                                </label>
                                                <small>
                                                    {" "}
                                                    -{" "}
                                                    {translate(
                                                        "click_to_view_the_file"
                                                    )}
                                                </small>
                                                <div
                                                    style={{
                                                        display: "block",
                                                        width: "100%"
                                                    }}
                                                >
                                                    {this.state.activity_plan &&
                                                    this.state.activity_plan[0]
                                                        .download_link ? (
                                                        <>
                                                            <a
                                                                target="_blank"
                                                                href={`/storage/${this.state.activity_plan[0].download_link}`}
                                                                className="btn btn-primary"
                                                            >
                                                                <svg
                                                                    className="bi bi-link-45deg"
                                                                    width="1em"
                                                                    height="1em"
                                                                    viewBox="0 0 16 16"
                                                                    fill="currentColor"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                                                                    <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z" />
                                                                    <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                                                                    <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z" />
                                                                </svg>
                                                                {"  "}
                                                                {this.state
                                                                    .activity_plan[0]
                                                                    .original_name ||
                                                                    translate(
                                                                        "name_not_available"
                                                                    )}
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="alert alert-info text-center"
                                                            role="alert"
                                                        >
                                                            {translate(
                                                                "no_result_found"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate(
                                                        "technical_design_plan"
                                                    )}
                                                </label>
                                                <small>
                                                    {" "}
                                                    -{" "}
                                                    {translate(
                                                        "click_to_view_the_file"
                                                    )}
                                                </small>
                                                <div
                                                    style={{
                                                        display: "block",
                                                        width: "100%"
                                                    }}
                                                >
                                                    {this.state
                                                        .technical_design_plan &&
                                                    this.state
                                                        .technical_design_plan[0]
                                                        .download_link ? (
                                                        <>
                                                            <a
                                                                target="_blank"
                                                                href={`/storage/${this.state.technical_design_plan[0].download_link}`}
                                                                className="btn btn-primary"
                                                            >
                                                                <svg
                                                                    className="bi bi-link-45deg"
                                                                    width="1em"
                                                                    height="1em"
                                                                    viewBox="0 0 16 16"
                                                                    fill="currentColor"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                                                                    <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z" />
                                                                    <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                                                                    <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z" />
                                                                </svg>
                                                                {"  "}
                                                                {this.state
                                                                    .technical_design_plan[0]
                                                                    .original_name ||
                                                                    "Name not available"}
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="alert alert-info text-center"
                                                            role="alert"
                                                        >
                                                            {translate(
                                                                "no_result_found"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate("description")}
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .description || ""
                                                    }
                                                ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate("impacts")}
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .impacts || ""
                                                    }
                                                ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate(
                                                        "beneficiaries_men"
                                                    )}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .beneficiaries_men ||
                                                        ""
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    style={{
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {translate(
                                                        "beneficiaries_women"
                                                    )}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={
                                                        this.state.details
                                                            .beneficiaries_women ||
                                                        ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-3"
                                    role="tabpanel"
                                    aria-labelledby="nav-3-tab"
                                >
                                    <div
                                        className="container"
                                        style={{ paddingTop: 30 }}
                                    >
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "file_for_initial_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                {this.state.initial_stage
                                                    .download_link &&
                                                (this.state.initial_stage.download_link.includes(
                                                    ".pdf"
                                                ) ||
                                                    this.state.initial_stage.download_link.includes(
                                                        ".doc"
                                                    ) ||
                                                    this.state.initial_stage.download_link.includes(
                                                        ".xls"
                                                    )) ? (
                                                    <>
                                                        <a
                                                            target="_blank"
                                                            href={`/storage/${this.state.initial_stage.download_link}`}
                                                            className="btn btn-primary"
                                                        >
                                                            <svg
                                                                className="bi bi-link-45deg"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                                                                <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z" />
                                                                <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                                                                <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z" />
                                                            </svg>
                                                            {"  "}
                                                            {this.state
                                                                .initial_stage
                                                                .original_name ||
                                                                translate(
                                                                    "name_not_available"
                                                                )}
                                                        </a>
                                                    </>
                                                ) : this.state.initial_stage
                                                      .download_link ? (
                                                    <>
                                                        <img
                                                            id="initial_stage"
                                                            src={`/storage/${this.state.initial_stage.download_link}`}
                                                            className="img-fluid"
                                                            alt="Responsive image"
                                                            style={{
                                                                width:"100%",
                                                                maxHeight: 300
                                                            }}
                                                        />
                                                        <hr />
                                                        <button
                                                            onClick={() =>
                                                                this.getImageDetails(
                                                                    "initial_stage"
                                                                )
                                                            }
                                                            className="btn btn-dark"
                                                            style={{
                                                                marginBottom:
                                                                    "2%"
                                                            }}
                                                        >
                                                            {translate(
                                                                "get_all_metadata"
                                                            )}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div>
                                                        {translate(
                                                            "initial_stage_file_not_available"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "note_for_initial_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            this.state.details
                                                                .initial_stage_note ||
                                                            translate(
                                                                "note_not_available"
                                                            )
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="col-md-12">
                                                {this.state.metaLoading ? (
                                                    <div className="text-center">
                                                        <div
                                                            className="spinner-border m-5"
                                                            role="status"
                                                        >
                                                            <span className="sr-only">
                                                                {translate(
                                                                    "loading"
                                                                )}
                                                                ...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : this.state
                                                      .initialStageMetaData ? (
                                                    <>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "image_metadata_info"
                                                                    )}
                                                                </h3>
                                                                <JsonToTable
                                                                    json={
                                                                        this
                                                                            .state
                                                                            .initialStageMetaData ||
                                                                        {}
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "gps_info"
                                                                    )}
                                                                </h3>
                                                                {this.state
                                                                    .is_lat &&
                                                                this.state
                                                                    .is_long ? (
                                                                    <>
                                                                        <iframe
                                                                            src={`https://maps.google.com/maps?q=${this.state.is_lat}, ${this.state.is_long}&z=12&output=embed`}
                                                                            width="100%"
                                                                            height="400"
                                                                            frameBorder="0"
                                                                        ></iframe>
                                                                        <hr />
                                                                        <a
                                                                            className="btn btn-link"
                                                                            href={`https://www.google.com/maps/place/${this.state.is_lat}+${this.state.is_long}/@${this.state.is_lat},${this.state.is_long},12z`}
                                                                            target="_blank"
                                                                        >
                                                                            {translate(
                                                                                "open_it_on_google_maps"
                                                                            )}
                                                                        </a>
                                                                    </>
                                                                ) : (
                                                                    <p>
                                                                        {this
                                                                            .state
                                                                            .gpsNotFoundMsg1 ||
                                                                            "GPS info not available"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : this.state.notFoundMsg1 ? (
                                                    <div
                                                        style={{
                                                            marginTop: "2%"
                                                        }}
                                                        className="alert alert-danger text-center"
                                                        role="alert"
                                                    >
                                                        {
                                                            this.state
                                                                .notFoundMsg1
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-4"
                                    role="tabpanel"
                                    aria-labelledby="nav-4-tab"
                                >
                                    <div
                                        className="container"
                                        style={{ paddingTop: 30 }}
                                    >
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "file_for_execution_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                {this.state.execution_stage
                                                    .download_link &&
                                                (this.state.execution_stage.download_link.includes(
                                                    ".pdf"
                                                ) ||
                                                    this.state.execution_stage.download_link.includes(
                                                        ".doc"
                                                    ) ||
                                                    this.state.execution_stage.download_link.includes(
                                                        ".xls"
                                                    )) ? (
                                                    <>
                                                        <a
                                                            target="_blank"
                                                            href={`/storage/${this.state.execution_stage.download_link}`}
                                                            className="btn btn-primary"
                                                        >
                                                            <svg
                                                                className="bi bi-link-45deg"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                                                                <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z" />
                                                                <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                                                                <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z" />
                                                            </svg>
                                                            {"  "}
                                                            {this.state
                                                                .execution_stage
                                                                .original_name ||
                                                                translate(
                                                                    "name_not_available"
                                                                )}
                                                        </a>
                                                    </>
                                                ) : this.state.execution_stage
                                                      .download_link ? (
                                                    <>
                                                        <img
                                                            id="execution_stage"
                                                            src={`/storage/${this.state.execution_stage.download_link}`}
                                                            className="img-fluid"
                                                            alt="Responsive image"
                                                            style={{
                                                                width:"100%",
                                                                maxHeight: 300
                                                            }}
                                                        />
                                                        <hr />
                                                        <button
                                                            onClick={() =>
                                                                this.getImageDetails(
                                                                    "execution_stage"
                                                                )
                                                            }
                                                            className="btn btn-dark"
                                                            style={{
                                                                marginBottom:
                                                                    "2%"
                                                            }}
                                                        >
                                                            {translate(
                                                                "get_all_metadata"
                                                            )}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div>
                                                        {translate(
                                                            "execution_stage_file_not_available"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "note_for_execution_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            this.state.details
                                                                .execution_stage_note ||
                                                            translate(
                                                                "note_not_available"
                                                            )
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="col-md-12">
                                                {this.state.metaLoading ? (
                                                    <div className="text-center">
                                                        <div
                                                            className="spinner-border m-5"
                                                            role="status"
                                                        >
                                                            <span className="sr-only">
                                                                {translate(
                                                                    "loading"
                                                                )}
                                                                ...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : this.state
                                                      .executionStageMetaData ? (
                                                    <>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "image_metadata_info"
                                                                    )}
                                                                </h3>
                                                                <JsonToTable
                                                                    json={
                                                                        this
                                                                            .state
                                                                            .executionStageMetaData ||
                                                                        {}
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "gps_info"
                                                                    )}
                                                                </h3>
                                                                {this.state
                                                                    .es_lat &&
                                                                this.state
                                                                    .es_long ? (
                                                                    <>
                                                                        <iframe
                                                                            src={`https://maps.google.com/maps?q=${this.state.es_lat}, ${this.state.es_long}&z=12&output=embed`}
                                                                            width="100%"
                                                                            height="400"
                                                                            frameBorder="0"
                                                                        ></iframe>
                                                                        <hr />
                                                                        <a
                                                                            className="btn btn-link"
                                                                            href={`https://www.google.com/maps/place/${this.state.es_lat}+${this.state.es_long}/@${this.state.es_lat},${this.state.es_long},12z`}
                                                                            target="_blank"
                                                                        >
                                                                            {translate(
                                                                                "open_it_on_google_maps"
                                                                            )}
                                                                        </a>
                                                                    </>
                                                                ) : (
                                                                    <p>
                                                                        {this
                                                                            .state
                                                                            .gpsNotFoundMsg2 ||
                                                                            "GPS info not available"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : this.state.notFoundMsg2 ? (
                                                    <div
                                                        style={{
                                                            marginTop: "2%"
                                                        }}
                                                        className="alert alert-danger text-center"
                                                        role="alert"
                                                    >
                                                        {
                                                            this.state
                                                                .notFoundMsg2
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-5"
                                    role="tabpanel"
                                    aria-labelledby="nav-5-tab"
                                >
                                    <div
                                        className="container"
                                        style={{ paddingTop: 30 }}
                                    >
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "file_for_final_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                {this.state.final_stage
                                                    .download_link &&
                                                (this.state.final_stage.download_link.includes(
                                                    ".pdf"
                                                ) ||
                                                    this.state.final_stage.download_link.includes(
                                                        ".doc"
                                                    ) ||
                                                    this.state.final_stage.download_link.includes(
                                                        ".xls"
                                                    )) ? (
                                                    <>
                                                        <a
                                                            target="_blank"
                                                            href={`/storage/${this.state.final_stage.download_link}`}
                                                            className="btn btn-primary"
                                                        >
                                                            <svg
                                                                className="bi bi-link-45deg"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                                                                <path d="M5.712 6.96l.167-.167a1.99 1.99 0 01.896-.518 1.99 1.99 0 01.518-.896l.167-.167A3.004 3.004 0 006 5.499c-.22.46-.316.963-.288 1.46z" />
                                                                <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                                                                <path d="M10 9.5a2.99 2.99 0 00.288-1.46l-.167.167a1.99 1.99 0 01-.896.518 1.99 1.99 0 01-.518.896l-.167.167A3.004 3.004 0 0010 9.501z" />
                                                            </svg>
                                                            {"  "}
                                                            {this.state
                                                                .final_stage
                                                                .original_name ||
                                                                translate(
                                                                    "name_not_available"
                                                                )}
                                                        </a>
                                                    </>
                                                ) : this.state.final_stage
                                                      .download_link ? (
                                                    <>
                                                        <img
                                                            id="final_stage"
                                                            src={`/storage/${this.state.final_stage.download_link}`}
                                                            className="img-fluid"
                                                            alt="Responsive image"
                                                            style={{
                                                                width:"100%",
                                                                maxHeight: 300
                                                            }}
                                                        />
                                                        <hr />
                                                        <button
                                                            onClick={() =>
                                                                this.getImageDetails(
                                                                    "final_stage"
                                                                )
                                                            }
                                                            className="btn btn-dark"
                                                            style={{
                                                                marginBottom:
                                                                    "2%"
                                                            }}
                                                        >
                                                            {translate(
                                                                "get_all_metadata"
                                                            )}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div>
                                                        {translate(
                                                            "final_stage_file_not_available"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <h3>
                                                    {translate(
                                                        "note_for_final_stage"
                                                    )}
                                                    :
                                                </h3>
                                                <hr />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            this.state.details
                                                                .final_stage_note ||
                                                            translate(
                                                                "note_not_available"
                                                            )
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="col-md-12">
                                                {this.state.metaLoading ? (
                                                    <div className="text-center">
                                                        <div
                                                            className="spinner-border m-5"
                                                            role="status"
                                                        >
                                                            <span className="sr-only">
                                                                {translate(
                                                                    "loading"
                                                                )}
                                                                ...
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : this.state
                                                      .finalStageMetaData ? (
                                                    <>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "image_metadata_info"
                                                                    )}
                                                                </h3>
                                                                <JsonToTable
                                                                    json={
                                                                        this
                                                                            .state
                                                                            .finalStageMetaData ||
                                                                        {}
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <h3
                                                                    align="center"
                                                                    style={{
                                                                        marginTop:
                                                                            "3%",
                                                                        marginBottom:
                                                                            "3%"
                                                                    }}
                                                                >
                                                                    {translate(
                                                                        "gps_info"
                                                                    )}
                                                                </h3>
                                                                {this.state
                                                                    .fs_lat &&
                                                                this.state
                                                                    .fs_long ? (
                                                                    <>
                                                                        <iframe
                                                                            src={`https://maps.google.com/maps?q=${this.state.fs_lat}, ${this.state.fs_long}&z=12&output=embed`}
                                                                            width="100%"
                                                                            height="400"
                                                                            frameBorder="0"
                                                                        ></iframe>
                                                                        <hr />
                                                                        <a
                                                                            className="btn btn-link"
                                                                            href={`https://www.google.com/maps/place/${this.state.fs_lat}+${this.state.fs_long}/@${this.state.fs_lat},${this.state.fs_long},12z`}
                                                                            target="_blank"
                                                                        >
                                                                            {translate(
                                                                                "open_it_on_google_maps"
                                                                            )}
                                                                        </a>
                                                                    </>
                                                                ) : (
                                                                    <p>
                                                                        {this
                                                                            .state
                                                                            .gpsNotFoundMsg3 ||
                                                                            "GPS info not available"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : this.state.notFoundMsg3 ? (
                                                    <div
                                                        style={{
                                                            marginTop: "2%"
                                                        }}
                                                        className="alert alert-danger text-center"
                                                        role="alert"
                                                    >
                                                        {
                                                            this.state
                                                                .notFoundMsg3
                                                        }
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="alert alert-info text-center"
                            role="alert"
                        >
                            {translate("no_result_found")}
                        </div>
                    )}
                </main>
            </>
        );
    }
}
