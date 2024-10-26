import { Icon } from "@iconify/react/dist/iconify.js";
import {
    ActionButton, Column, Container, CopyButton, DrawerDialog, Expanded, Field, Image, ModalProps,
    Notify, Padding, Pager, Row, SimpleStep, SizedBox, Spacer, Text, useDesign, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { Popup } from "@serchservice/web-ui-kit/build/src/utilities/Notify";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../backend/api/Connect";
import Keys from "../../backend/api/Keys";
import adminStore from "../../backend/database/auth/AdminStore";
import authStore from "../../backend/database/auth/AuthStore";
import Admin from "../../backend/models/profile/Admin";
import { RouteInterface } from "../../configuration/Route";
import AppTheme from "../../configuration/Theme";
import Utils from "../../utils/Utils";
import Title from "../../widgets/Title";
import ProfilePageLoader from "./loader";
import PermissionRoute from "./permission/page";

export default function ProfileRoute(): RouteInterface {
    return {
        path: "/profile",
        page: <Layout />,
        children: [
            PermissionRoute()
        ]
    }
}

const Layout: React.FC = () => {
    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.LOGGED_IN_ADMIN("PROFILE")],
        queryFn: () => connect.get("/admin/profile")
    })

    const [account, setAccount] = React.useState<Admin>(adminStore.read)

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    const admin = Admin.fromJson(data.data);
                    adminStore.set(admin);
                    setAccount(admin)
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const render = (): JSX.Element => {
        if(!account || isLoading) {
            return (<ProfilePageLoader />)
        } else {
            return (
                <React.Fragment>
                    <LeftView />
                    <RightView />
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            <Titled />
            <Row mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start" style={{overflow: "hidden"}}>
                {render()}
            </Row>
        </React.Fragment>
    )
}

const Titled: React.FC = observer(() => {
    return (<Title title={`${authStore.read.firstName}'s Profile`} useDesktopWidth description="Your profile, your settings" />)
})

const LeftView: React.FC = observer(() => {
    const steps = [
        {
            title: "Email Confirmation",
            value: adminStore.read.profile.emailConfirmedAt
        },
        {
            title: "Account Creation",
            value: adminStore.read.profile.accountCreatedAt
        },
        {
            title: "Profile Creation",
            value: adminStore.read.profile.profileCreatedAt
        },
        {
            title: "Last Profile Update",
            value: adminStore.read.profile.profileUpdatedAt
        },
        {
            title: "Last Account Update",
            value: adminStore.read.profile.accountUpdatedAt
        }
    ]

    const [isUpdatingAvatar, setIsUpdatingAvatar] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleChangeAvatar = () => {
        if (isUpdatingAvatar || !fileInputRef.current) {
            return;
        }
        fileInputRef.current.click();
    };

    const connect = new Connect({})

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return;

        const data = await Utility.getUpload(file);
        if (data) {
            setIsUpdatingAvatar(true);
            const response = await connect.patch("/admin/profile/upload", data.toJson());
            setIsUpdatingAvatar(false);
            if (response) {
                if (response.isSuccess) {
                    const admin = Admin.fromJson(response.data);
                    adminStore.set(admin);
                    authStore.set(authStore.read.copyWith({ avatar: admin.profile.avatar }));
                } else {
                    Notify.error(response.message);
                }
            }
        } else {
            Notify.error('An error occurred while fetching the image you uploaded');
        }
    };

    const renderAvatar = (): JSX.Element => {
        if(isUpdatingAvatar) {
            return (
                <Icon
                    icon="svg-spinners:90-ring-with-bg"
                    width="2em"
                    height="2em"
                    style={{color: AppTheme.primary, alignSelf: "center", margin: "auto"}}
                />
            )
        } else {
            return (
                <Image
                    image={adminStore.read.profile.avatar}
                    style={{borderRadius: "50%"}}
                    height="100%"
                    width="100%"
                />
            )
        }
    }

    const buttons = ["Update avatar", "See my activities"]

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    async function click(index: number) {
        if(index === 0) {
            handleChangeAvatar()
        } else {
            handleOpen()
        }
    }

    return (
        <React.Fragment>
            <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "24px", maxWidth: "450px", overflow: "scroll"}}>
                <Column>
                    <Container height="120px" width="120px" borderRadius="50%" backgroundColor={AppTheme.appbar} style={{
                        border: `2px solid ${AppTheme.hint}`,
                        padding: "2px",
                        textAlign: "center",
                        alignContent: "center"
                    }}>
                        {renderAvatar()}
                    </Container>
                    <SizedBox height={15} />
                    <Text text={adminStore.read.profile.name} size={16} color={AppTheme.primary} />
                    <SizedBox height={4} />
                    <Text text={adminStore.read.profile.emailAddress} size={12} color={AppTheme.hint} />
                    <SizedBox height={4} />
                    <Row crossAxis="center">
                        <Container borderRadius="12px" backgroundColor={AppTheme.appbar} padding="6px">
                            <Text text={`ID: ${adminStore.read.profile.id}`} size={12} color={AppTheme.hint} />
                        </Container>
                        <SizedBox width={20} />
                        <CopyButton data={adminStore.read.profile.id} color={AppTheme.hint} />
                    </Row>
                    <Container borderRadius="12px" margin="50px 0" maxWidth={350} backgroundColor={AppTheme.appbar} padding="12px" width="auto">
                        <Text text="Account timeline" size={12} color={AppTheme.hint} />
                        <SizedBox height={12} />
                        {steps.map((step, index) => {
                            return (
                                <SimpleStep
                                    key={index}
                                    content={
                                        <Padding only={{top: 3}}>
                                            <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                <Spacer />
                                                <Text text={step.value} size={14} color={AppTheme.primary} />
                                            </Row>
                                        </Padding>
                                    }
                                    height={10}
                                    color={AppTheme.hint}
                                    showBottom={steps.length - 1 !== index}
                                />
                            )
                        })}
                    </Container>
                    {buttons.map((button, index) => {
                        const color = Utility.getRandomColor();

                        return (
                            <Row key={index}>
                                <Container
                                    backgroundColor={color}
                                    width="auto"
                                    padding="10px"
                                    borderRadius="24px"
                                    onClick={() => click(index)}
                                    hoverBackgroundColor={Utility.lightenColor(color, 20)}
                                    margin={buttons.length - 1 !== index ? "0 0 10px 0" : ""}
                                >
                                    <Text text={button} size={12} color={Utility.lightenColor(color, 70)} />
                                </Container>
                            </Row>
                        )
                    })}
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                </Column>
            </Column>
            <ActivityView isOpen={open} handleClose={handleClose} />
        </React.Fragment>
    )
})

const ActivityView: React.FC<ModalProps> = observer(({ isOpen, handleClose }) => {
    const [activities, setActivities] = React.useState(adminStore.read.activities);
    const isEmpty = activities.length === 0;

    const render = (): JSX.Element => {
        if(isEmpty) {
            return (
                <Expanded>
                    <Text text="No activities" color={AppTheme.primary} />
                </Expanded>
            )
        } else {
            return (
                <React.Fragment>
                    {activities.map((activity, index) => {
                        return (
                            <SimpleStep
                                key={index}
                                content={
                                    <Container backgroundColor={AppTheme.appbar} borderRadius="12px" padding="12px" width="100%">
                                        <Text text={activity.label} size={12} color={AppTheme.hint} />
                                        <SizedBox height={6} />
                                        <Text text={activity.activity} size={13} color={AppTheme.primary} />
                                    </Container>
                                }
                                color={AppTheme.hint}
                                showBottom={activities.length - 1 !== index}
                            />
                        )
                    })}
                </React.Fragment>
            )
        }
    }

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.background} width="400px">
            <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "12px"}}>
                <Column mainAxisSize="max" crossAxisSize="max" style={{overflow: isEmpty ? "hidden" : "scroll"}}>
                    <Column>
                        <Text text="Activities" size={15} color={AppTheme.hint} />
                        <SizedBox height={30} />
                        {render()}
                    </Column>
                </Column>
                <Pager items={adminStore.read.activities} onSlice={setActivities} itemsPerPage={10} />
            </Column>
        </DrawerDialog>
    )
})

const RightView: React.FC = observer(() => {
    const { width, isMobile } = useDesign()

    const connect = new Connect({})

    const [isUpdateProfile, setIsUpdateProfile] = React.useState(false)
    const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false)
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")

    const handleChangeProfile = async () => {
        if (isUpdatingProfile) {
            return
        } else {
            const canUpdate = firstName !== "" || lastName !== "";

            if (isUpdateProfile && canUpdate) {
                setIsUpdatingProfile(true);
                const response = await connect.patch("/admin/profile/update", {
                    firstName: firstName,
                    lastName: lastName
                })
                setIsUpdatingProfile(false);
                if(response) {
                    if (response.isSuccess) {
                        setIsUpdateProfile(false)
                        if(response.data) {
                            adminStore.set(Admin.fromJson(response.data))
                        }
                    } else {
                        Notify.error(response.message)
                    }
                }
            } else if(isUpdateProfile) {
                setIsUpdateProfile(false)
                Notify.info("Profile update is now locked. Couldn't detect any new changes", 3000, Popup.BOTTOMLEFT)
            } else {
                setIsUpdateProfile(true)
                Notify.info("Profile update is now unlocked", 3000, Popup.BOTTOMLEFT)
            }
        }
    }

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "24px", overflow: "scroll"}}>
            <Column mainAxisSize="min" crossAxisSize="max" style={{border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
                <Text text="Profile Details" size={12} color={AppTheme.hint} />
                <SizedBox height={30} />
                <Wrap runSpacing={20} spacing={20}>
                    <div style={{width: width <= 1080 ? "100%" : "48.4%"}}>
                        <Field
                            placeHolder={adminStore.read.profile.firstName}
                            needLabel={true}
                            label="First Name"
                            type="text"
                            value={adminStore.read.profile.firstName}
                            isDisabled={isUpdateProfile === false}
                            onChange={(value) => setFirstName(value)}
                            needSpacer={false}
                            backgroundColor={AppTheme.secondary}
                            fontSize={isMobile ? 14 : 16}
                            color={AppTheme.primary}
                            labelColor={AppTheme.primary}
                        />
                    </div>
                    <div style={{width: width <= 1080 ? "100%" : "48.4%"}}>
                        <Field
                            placeHolder={adminStore.read.profile.lastName}
                            needLabel={true}
                            label="Last Name"
                            type="text"
                            value={adminStore.read.profile.lastName}
                            isDisabled={isUpdateProfile === false}
                            onChange={(value) => setLastName(value)}
                            needSpacer={false}
                            backgroundColor={AppTheme.secondary}
                            fontSize={isMobile ? 14 : 16}
                            color={AppTheme.primary}
                            labelColor={AppTheme.primary}
                        />
                    </div>
                </Wrap>
                <SizedBox height={20} />
                <Field
                    needLabel={true}
                    label="Email Address"
                    type="email"
                    value={adminStore.read.profile.emailAddress}
                    isDisabled={true}
                    backgroundColor={AppTheme.secondary}
                    fontSize={isMobile ? 14 : 16}
                    color={AppTheme.primary}
                    labelColor={AppTheme.primary}
                />
                <SizedBox height={50} />
                <ActionButton
                    padding="10px 36px"
                    backgroundColor={AppTheme.appbarLight}
                    fontSize={14}
                    onClick={handleChangeProfile}
                    useLoader={isUpdatingProfile}
                    state={isUpdatingProfile}
                    title={isUpdateProfile ? "Update Profile" : "Tap to open update"}
                />
            </Column>
            <Column mainAxisSize="min" crossAxisSize="max" style={{marginTop: "60px", border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
                <Text text="Team Details" size={12} color={AppTheme.hint} />
                <SizedBox height={30} />
                <Wrap runSpacing={20} spacing={20}>
                    {[
                        {
                            label: "Department",
                            value: adminStore.read.team.department
                        },
                        {
                            label: "Position",
                            value: adminStore.read.team.position
                        },
                        {
                            label: "Role",
                            value: adminStore.read.team.role
                        }
                    ].map((item, index) => {
                        return (
                            <div key={index} style={{width: width <= 1080 ? "100%" : "48.4%"}}>
                                <Field
                                    needLabel={true}
                                    label={item.label}
                                    value={Utils.clearRole(item.value)}
                                    isDisabled={true}
                                    needSpacer={false}
                                    backgroundColor={AppTheme.secondary}
                                    fontSize={isMobile ? 14 : 16}
                                    color={AppTheme.primary}
                                    labelColor={AppTheme.primary}
                                />
                            </div>
                        )
                    })}
                </Wrap>
            </Column>
        </Column>
    )
})