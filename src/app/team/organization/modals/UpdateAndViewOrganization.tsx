import { ActionButton, Column, Container, DrawerDialog, Field, Image, ModalProps, Notify, Row, SizedBox, Spacer, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import { OrganizationResponse } from "../../../../backend/models/team/OrganizationResponse";
import AppTheme from "../../../../configuration/Theme";
import Connect from "../../../../backend/api/Connect";
import Utils from "../../../../utils/Utils";

interface UpdateAndViewInterface extends ModalProps {
    onUpdated: (data: OrganizationResponse[]) => void;
    org: OrganizationResponse;
}

const UpdateAndViewOrganization: React.FC<UpdateAndViewInterface> = observer(({ isOpen, handleClose, onUpdated, org }) => {
    const connect = new Connect({})

    const [data, setData] = React.useState({
        first_name: org.firstName,
        last_name: org.lastName,
        email_address: org.emailAddress,
        avatar: org.avatar,
        instagram: org.instagram,
        linkedIn: org.linkedIn,
        twitter: org.twitter,
        position: org.position,
        phone_number: org.phoneNumber,
        username: org.username
    })

    const hasChanges = JSON.stringify({
        first_name: org.firstName,
        last_name: org.lastName,
        email_address: org.emailAddress,
        avatar: org.avatar,
        instagram: org.instagram,
        linkedIn: org.linkedIn,
        twitter: org.twitter,
        position: org.position,
        phone_number: org.phoneNumber,
        username: org.username
    }) !== JSON.stringify(data)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const validate = (): boolean => {
        if(!data.first_name.trim() || data.first_name.trim() === "" || data.first_name.trim().length < 3) {
            Notify.warning("First name cannot be empty or less than 3 characters")
            return false
        }

        if(!data.last_name.trim() || data.last_name.trim() === "" || data.last_name.trim().length < 3) {
            Notify.warning("Last name cannot be empty or less than 3 characters")
            return false
        }

        if(!data.email_address.trim() || data.email_address.trim() === "") {
            Notify.warning("Email address cannot be empty")
            return false
        }

        if(!data.email_address.trim().endsWith("@serchservice.com")) {
            Notify.warning("Email address must be of Serchservice organization email domain")
            return false
        }

        if(!data.username || data.username === "") {
            Notify.warning(`${data.first_name} needs a username`)
            return false
        }

        if(!data.position.trim() || data.position.trim() === "" || data.position.trim().length < 3) {
            Notify.warning("Position cannot be empty or less than 3 characters")
            return false
        }

        if(!data.phone_number.trim() || data.phone_number.trim() === "" || data.phone_number.trim().length < 11 || data.phone_number.trim().length > 11) {
            Notify.warning("Phone number cannot be empty or more/less than 11 characters")
            return false
        }

        return true
    }

    async function handleUpdate() {
        if(isLoading) {
            return
        } else {
            if (!validate()) {
                return
            }

            setIsLoading(true)
            const response = await connect.patch(`/organization/update?id=${org.id}`, data)
            setIsLoading(false)
            if (response) {
                if (response.isSuccess) {
                    Notify.success(`${data.first_name} is now updated`)
                    if(Array.isArray(response.data)) {
                        onUpdated(response.data.map(d => OrganizationResponse.fromJson(d)))
                    }
                    handleClose()
                    return
                } else {
                    Notify.error(response.message)
                    return
                }
            }
        }
    }

    const extractBase64 = (): string => {
        const base64Prefix = 'data:image/png;base64,';
        if (org.qrCode.startsWith(base64Prefix)) {
            return org.qrCode.substring(base64Prefix.length);
        }
        return org.qrCode;
    };

    function handleDownload() {
        // Convert base64 to raw data
        const byteCharacters = atob(extractBase64());
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        Utils.downloadFile(byteArray, `${org.firstName}'s QR Code`, 'image/png')
    }

    async function handleDelete() {
        if(isDeleting) {
            return
        } else {
            setIsDeleting(true)
            const response = await connect.delete(`/organization/${org.id}`)
            setIsDeleting(false)
            if (response) {
                if (response.isSuccess) {
                    Notify.success(`${data.first_name} is now deleted`)
                    if(Array.isArray(response.data)) {
                        onUpdated(response.data.map(d => OrganizationResponse.fromJson(d)))
                    }
                    handleClose()
                    return
                } else {
                    Notify.error(response.message)
                    return
                }
            }
        }
    }

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width="80%">
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text={`View ${data.first_name}'s information`} color={AppTheme.primary} size={16} />
                </Container>
                <SizedBox height={30} />
                <form>
                    <Column crossAxis="center" mainAxisSize="min" gap="30px" style={{padding: "20px"}}>
                        <Image image={data.avatar ?? Utility.DEFAULT_IMAGE} height={200} width={200} style={{
                            borderRadius: "50%",
                            backgroundColor: AppTheme.appbarDark,
                            padding: "1px"
                        }}/>
                        <SizedBox height={30} />
                        <Wrap spacing={20} runSpacing={10}>
                            {[
                                {
                                    label: "First Name",
                                    value: data.first_name,
                                    onUpdate: (value: string) => setData({ ...data, first_name: value }),
                                },
                                {
                                    label: "Last Name",
                                    value: data.last_name,
                                    onUpdate: (value: string) => setData({ ...data, last_name: value }),
                                },
                                {
                                    label: "Email Address",
                                    value: data.email_address,
                                    tyle: "email",
                                    onUpdate: (value: string) => setData({ ...data, email_address: value }),
                                },
                                {
                                    label: "Username",
                                    value: data.username,
                                    onUpdate: (value: string) => setData({ ...data, username: value }),
                                },
                                {
                                    label: "Profile Picture",
                                    value: data.avatar,
                                    onUpdate: (value: string) => setData({ ...data, avatar: value }),
                                },
                                {
                                    label: "Instagram Link",
                                    value: data.instagram,
                                    onUpdate: (value: string) => setData({ ...data, instagram: value }),
                                },
                                {
                                    label: "Twitter Link",
                                    value: data.twitter,
                                    onUpdate: (value: string) => setData({ ...data, twitter: value }),
                                },
                                {
                                    label: "LinkedIn",
                                    value: data.linkedIn,
                                    onUpdate: (value: string) => setData({ ...data, linkedIn: value }),
                                },
                                {
                                    label: "Position",
                                    value: data.position,
                                    onUpdate: (value: string) => setData({ ...data, position: value }),
                                },
                                {
                                    label: "Phone number",
                                    value: data.phone_number,
                                    type: "tel",
                                    onUpdate: (value: string) => setData({ ...data, phone_number: value }),
                                }
                            ].map((item, index) => (
                                <Field
                                    key={index}
                                    backgroundColor={AppTheme.appbar}
                                    color={AppTheme.primary}
                                    label={item.label}
                                    placeHolder=""
                                    value={item.value}
                                    fontSize={14}
                                    type={item.type ?? 'text'}
                                    onChange={item.onUpdate}
                                    labelColor={AppTheme.primary}
                                    parentStyle={{width: "48%"}}
                                />
                            ))}
                        </Wrap>
                        <SizedBox height={30} />
                        {hasChanges && (
                            <ActionButton
                                padding="10px 16px"
                                backgroundColor={AppTheme.appbarLight}
                                fontSize={14}
                                onClick={handleUpdate}
                                useLoader={isLoading}
                                state={isLoading}
                                title={`Update ${data.first_name} information`}
                            />
                        )}
                        <Container
                            border={`1px solid ${Utility.lightenColor(AppTheme.success, 10)}`}
                            padding="10px"
                            width="100%"
                        >
                            <Row gap="10px">
                                <Image image={org.qrCode} width="70px" height="70px" objectFit="contain" />
                                <Column gap="10px">
                                    <Text text={`This is the QR Code for ${data.first_name} which can be used for business card generation`} color="#fff" />
                                    <Row>
                                        <ActionButton
                                            padding="6px 16px"
                                            backgroundColor="transparent"
                                            fontSize={14}
                                            onClick={handleDownload}
                                            useLoader={isDeleting}
                                            state={isDeleting}
                                            borderRadius="12px"
                                            hoverBackgroundColor={Utility.lightenColor(AppTheme.success, 15)}
                                            hoverColor="#fff"
                                            color={AppTheme.success}
                                            title="Tap to download"
                                        />
                                    </Row>
                                </Column>
                            </Row>
                        </Container>
                        <Container
                            border={`1px solid ${Utility.lightenColor(AppTheme.error, 10)}`}
                            padding="10px"
                            width="100%"
                        >
                            <Row>
                                <Column>
                                    <Text
                                        text="This is a destructive action which will lead to the invalidation of any generate business card for this employee"
                                        color="#fff"
                                    />
                                </Column>
                                <Spacer />
                                <ActionButton
                                    padding="6px 16px"
                                    backgroundColor="transparent"
                                    fontSize={14}
                                    onClick={handleDelete}
                                    useLoader={isDeleting}
                                    state={isDeleting}
                                    borderRadius="12px"
                                    hoverBackgroundColor={Utility.lightenColor(AppTheme.error, 15)}
                                    hoverColor="#fff"
                                    color={AppTheme.error}
                                    title="Delete"
                                />
                            </Row>
                        </Container>
                    </Column>
                </form>
            </Column>
        </DrawerDialog>
    )
})

export default UpdateAndViewOrganization