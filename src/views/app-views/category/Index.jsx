import React, { useState } from "react";
import { Card, Row, Col, message, Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";

const { Dragger } = Upload;

function Index() {
    const [uploadedImg, setUploadedImage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);

    // Convert image file to base64
    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    const beforeUpload = (file) => {
        // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        // if (!isJpgOrPng) {
        //   message.error("You can only upload JPG/PNG file!");
        //   return false;
        // }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   message.error("Image must be smaller than 2MB!");
        //   return false;
        // }

        // Read file and set preview
        setUploadLoading(true);
        getBase64(file, (imageUrl) => {
            setUploadedImage(imageUrl);
            setUploadLoading(false);
        });

        return false; // Prevent default upload behavior
    };

    return (
        <div>
            <Row gutter={16}>

                <Col xs={24} sm={24} md={12}>
                    <Card title="Category Form">
                        <span>Thumbnail</span>
                        <Dragger
                            beforeUpload={beforeUpload}
                            showUploadList={false} // Hide default upload list
                            className="custom-category-img-holder"
                        >
                            {uploadedImg ? (
                                <div className="w-100 overflow-hidden" style={{ aspectRatio: "4/1" }}>
                                    <img src={uploadedImg} alt="uploaded" className="img-fluid w-100 h-100" style={{ objectFit: "cover" }} />
                                </div>
                            ) : (
                                <div className="w-100 d-flex align-items-center justify-content-center" style={{ aspectRatio: "4/1" }}>
                                    {uploadLoading ? (
                                        <div>
                                            <LoadingOutlined className="font-size-xxl text-primary" />
                                            <div className="mt-3">Uploading</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <CustomIcon className="display-3" svg={ImageSvg} />
                                            <p>Click or drag file to upload</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Dragger>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Card title="Category List">
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Index;
