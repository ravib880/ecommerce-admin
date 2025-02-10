import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Upload, Form, Input, Button, Table, Tag, Divider, Alert } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import axios from "axios";
import { BASE_URL, frontEndAPI, header, headerImage } from "constants/ApiConstant";
import { useSelector } from "react-redux";
import { motion } from "framer-motion"
// import "./index.less"; // Import your custom styles

const { Dragger } = Upload;

function Index() {
    const [uploadedImg, setUploadedImage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const adminData = useSelector(state => state.auth.adminData);
    const [form] = Form.useForm(); // Hook for managing form instance
    const [message, setMessage] = useState({ text: "", type: "error" });

    const beforeUpload = (file) => {
        setUploadLoading(true);

        // Store file object instead of converting to base64
        setUploadedImage(URL.createObjectURL(file));
        console.log("file::", file);

        setUploadLoading(false);
        form.setFieldsValue({ thumbnail: file }); // Set form field value

        return false; // Prevent default upload behavior
    };


    const onFinish = async (values) => {
        try {
            const { data } = await axios.post(frontEndAPI?.createCategory, values, headerImage(adminData?.token))
            console.log("data::", data);
            setMessage({
                text: "Ctageory created successfully!",
                type: "success"
            })
            getCategoryList();
        } catch (error) {
            console.error("error::", error);
            setMessage({
                text: "Unknown error occurs!",
                type: "error"
            })
        }
    };

    const columns = [
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (text) => <img src={`${BASE_URL + text}`} alt="Thumbnail" style={{ width: 50, height: 50, objectFit: "contain" }} />
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Action",
            key: "action",
            render: (text) => (
                <span>
                    <EditOutlined onClick={() => handleEditCategory(text)} />
                    <Divider type="vertical" />
                    <DeleteOutlined onClick={() => handleDeleteCategory(text)} />
                </span>
            )
        }
    ];

    // Get all categories
    const getCategoryList = async () => {
        try {
            const { data } = await axios.get(frontEndAPI?.getCategoryList, header(adminData?.token))
            if (data?.data)
                setCategoryData(data?.data);

        } catch (err) {
            console.err("err::", err);
        }
    }

    useEffect(() => {
        getCategoryList();
    }, [])

    // handle edit categories
    const handleEditCategory = async (item) => {
        try {

        } catch (error) {

        }
    }

    // handle delete categories
    const handleDeleteCategory = async (item) => {
        try {

        } catch (error) {

        }
    }

    return (
        <div className="category-container">
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Card title="Category Form">
                        {
                            message?.text &&
                            <motion.div
                                initial={{ opacity: 0, marginBottom: 0 }}
                                animate={{
                                    opacity: message?.text ? 1 : 0,
                                    marginBottom: message?.text ? 20 : 0
                                }}>
                                <Alert type={message?.type} showIcon message={message?.text}></Alert>
                            </motion.div>
                        }
                        <Form
                            form={form}
                            layout="vertical"
                            name="categoryForm"
                            onFinish={onFinish}
                        >
                            {/* Image Upload */}
                            <Form.Item
                                label="Thumbnail"
                                name="thumbnail"
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
                        <Table columns={columns} dataSource={categoryData} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Index;
