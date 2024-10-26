import { ActionButton, Column, Container, DrawerDialog, Field, Image, ModalProps, Notify, SizedBox, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import { OrganizationResponse } from "../../../../backend/models/team/OrganizationResponse";
import AppTheme from "../../../../configuration/Theme";
import Connect from "../../../../backend/api/Connect";

interface CreateInterface extends ModalProps {
    onUpdated: (data: OrganizationResponse[]) => void;
}

const CreateOrganization: React.FC<CreateInterface> = observer(({ isOpen, handleClose, onUpdated }) => {
    const connect = new Connect({})

    const [data, setData] = React.useState({
        first_name: "",
        last_name: "",
        email_address: "",
        avatar: "",
        instagram: "",
        linkedIn: "",
        twitter: "",
        position: "",
        phone_number: "",
        username: ""
    })
    const [isLoading, setIsLoading] = React.useState(false)

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

    async function invite() {
        if(isLoading) {
            return
        } else {
            if (!validate()) {
                return
            }

            setIsLoading(true)
            const response = await connect.post("/organization/add", data)
            setIsLoading(false)
            if (response) {
                if (response.isSuccess) {
                    Notify.success(`${data.first_name} is now added to the pool`)
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
                    <Text text="Create employee business information" color={AppTheme.primary} size={16} />
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
                        <ActionButton
                            padding="10px 16px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={14}
                            onClick={invite}
                            useLoader={isLoading}
                            state={isLoading}
                            title={`Create ${data.first_name || 'employee'}'s information`}
                        />
                    </Column>
                </form>
            </Column>
        </DrawerDialog>
    )
})

export default CreateOrganization