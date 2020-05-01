import React, { Component } from "react";

// Note: first install npm modules (exif-js and react-json-to-table)
import EXIF from "exif-js";
import { JsonToTable } from "react-json-to-table";

// Note: add bootrstrap 4 css to index.html (because some bootstrap 4 classes includes here)

export default class ExampleDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initialStageMetaData: undefined,
      metaLoading: false,
      notFoundMsg: "",
      gpsNotFoundMsg: "",
      is_lat: "",
      is_long: "",
    };
  }

  getImageDetails = async (id) => {
    this.setState({
      metaLoading: true,
      notFoundMsg: "",
      gpsNotFoundMsg: "",
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
    await EXIF.getData(file, async function () {
      var exifData = await EXIF.getAllTags(this);
      if (exifData && Object.keys(exifData).length !== 0) {
        result = exifData;
        msg = "";
        var aLat = EXIF.getTag(this, "GPSLatitude");
        var aLong = EXIF.getTag(this, "GPSLongitude");

        if (!(aLat && aLong)) {
          console.log("GPS info not found");
          gpsMsg = "gps_info_not_found";
        } else {
          gpsMsg = "";
          // convert from deg/min/sec to decimal for Google
          var strLatRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
          var strLongRef = EXIF.getTag(this, "GPSLongitudeRef") || "W";
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
        msg = "no_metadata_found_in_image";
      }
    });

    setTimeout(() => {
      if (id === "initial_stage") {
        this.setState({
          initialStageMetaData: result,
          metaLoading: false,
          notFoundMsg: msg,
          gpsNotFoundMsg: gpsMsg,
          is_lat: latitude,
          is_long: longitude,
        });
      }
    }, 3000);
    // settimeout is optional but recommended with loading for better result
  };

  render() {
    return (
      <>
        <img
          id="initial_stage"
          src={`https://picsum.photos/536/354`}
          // this is example image change to original path for example (www.yourwebsite.com/images/test.jpg)
          // local path images for example (http://localhost:3000/images/test.jpg) not working properly (CORS problem)
          className="img-fluid"
          alt="Responsive image"
          style={{
            width: "100%",
            maxHeight: 300,
          }}
        />
        <hr />
        <button
          onClick={() => this.getImageDetails("initial_stage")}
          className="btn btn-dark"
          style={{
            marginBottom: "2%",
          }}
        >
          {"get_all_metadata"}
        </button>

        <div className="col-md-12">
          {this.state.metaLoading ? (
            <div className="text-center">
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">
                  {"loading"}
                  ...
                </span>
              </div>
            </div>
          ) : this.state.initialStageMetaData ? (
            <>
              <div className="row">
                <div className="col-md-6">
                  <h3
                    align="center"
                    style={{
                      marginTop: "3%",
                      marginBottom: "3%",
                    }}
                  >
                    {"image_metadata_info"}
                  </h3>
                  <JsonToTable json={this.state.initialStageMetaData || {}} />
                </div>
                <div className="col-md-6">
                  <h3
                    align="center"
                    style={{
                      marginTop: "3%",
                      marginBottom: "3%",
                    }}
                  >
                    {"gps_info"}
                  </h3>
                  {this.state.is_lat && this.state.is_long ? (
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
                        {"open_it_on_google_maps"}
                      </a>
                    </>
                  ) : (
                    <p>
                      {this.state.gpsNotFoundMsg || "GPS info not available"}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : this.state.notFoundMsg ? (
            <div
              style={{
                marginTop: "2%",
              }}
              className="alert alert-danger text-center"
              role="alert"
            >
              {this.state.notFoundMsg}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}
