import React, { useState } from "react";
import { Card, Row, Col, message, Upload, Form, Input, Button, Table, Tag, Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import axios from "axios";
import { frontEndAPI } from "constants/ApiConstant";
// import "./index.less"; // Import your custom styles

const { Dragger } = Upload;

function Index() {
    const [uploadedImg, setUploadedImage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [form] = Form.useForm(); // Hook for managing form instance

    // Convert image file to base64
    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    const beforeUpload = (file) => {
        setUploadLoading(true);
        getBase64(file, (imageUrl) => {
            setUploadedImage(imageUrl);
            setUploadLoading(false);
            form.setFieldsValue({ image: imageUrl }); // Set form field value
        });
        return false; // Prevent default upload behavior
    };

    const onFinish = values => {
        console.log("Success:", values);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: text => <a href="/#">{text}</a>
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age"
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address"
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="/#">Invite {record.name}</a>
                    <Divider type="vertical" />
                    <a href="/#">Delete</a>
                </span>
            )
        }
    ];

    const getCategoryList = async () => {
        try {
            const {data } = await axios.get(frontEndAPI?.getCategoryList)
        } catch (err) {
            console.err("err::", err);
        }
    }

    const data = [
        {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["nice", "developer"]
        },
        {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["loser"]
        },
        {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sidney No. 1 Lake Park",
            tags: ["cool", "teacher"]
        }
    ];

    return (
        <div className="category-container">
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Card title="Category Form">
                        <Form
                            form={form}
                            layout="vertical"
                            name="categoryForm"
                            onFinish={onFinish}
                        >
                            {/* Image Upload */}
                            <Form.Item
                                label="Thumbnail"
                                name="image"
                                rules={[{ required: true, message: "Please upload a category image!" }]}
                            >
                                <Dragger
                                    beforeUpload={beforeUpload}
                                    showUploadList={false}
                                    className="custom-category-img-holder"
                                >
                                    {uploadedImg ? (
                                        <div className="w-100 overflow-hidden" style={{ aspectRatio: "4/1" }}>
                                            <img src={uploadedImg} alt="uploaded" className="w-100 h-100" style={{ objectFit: "contain" }} />
                                        </div>
                                    ) : (
                                        <div className="upload-content w-100 d-flex align-items-center justify-content-center" style={{ aspectRatio: "4/1" }}>
                                            {uploadLoading ? (
                                                <LoadingOutlined className="upload-loading" />
                                            ) : (
                                                <>
                                                    <CustomIcon className="upload-icon display-3" svg={ImageSvg} />
                                                    <p>Click or drag file to upload</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </Dragger>
                            </Form.Item>

                            {/* Category Name */}
                            <Form.Item
                                label="Category Name"
                                name="name"
                                rules={[{ required: true, message: "Please input your category name!" }]}
                            >
                                <Input placeholder="Enter category name" />
                            </Form.Item>

                            {/* Description */}
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input.TextArea placeholder="Enter description" />
                            </Form.Item>

                            {/* Submit Button */}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={12}>
                    <Card title="Category List">
                        <Table columns={columns} dataSource={data} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Index;
