import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    IconButton,
    Badge,
    CircularProgress,
    Tabs,
    Tab,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../services/firebase';
import { collection, query, where, orderBy, limit, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';

// 페이지 컨테이너 스타일링
const PageContainer = styled(Container)(({ theme }) => ({
    paddingBottom: theme.spacing(8),
}));

// 알림 카드 스타일링
const NotificationCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'visible',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(156, 39, 176, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: -1,
    },
}));

// 페이지 제목 스타일링
const PageTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Playfair Display', serif",
    fontWeight: 500,
    fontSize: '2.5rem',
    marginBottom: theme.spacing(5),
    position: 'relative',
    display: 'inline-block',
    fontStyle: 'italic',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        left: 0,
        width: 80,
        height: 3,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: 4,
    }
}));

// 알림 아이템 스타일링
const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
    padding: theme.spacing(2),
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    backgroundColor: isRead ? 'transparent' : 'rgba(156, 39, 176, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    }
}));

// 알림 시간 스타일링
const NotificationTime = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
}));

// 알림 상태 칩 스타일링
const StatusChip = styled(Chip)(({ theme, isRead }) => ({
    backgroundColor: isRead ? theme.palette.grey[300] : theme.palette.primary.light,
    color: isRead ? theme.palette.text.secondary : theme.palette.primary.contrastText,
    fontSize: '0.75rem',
    height: 24,
}));

// 빈 알림 컨테이너 스타일링
const EmptyNotification = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(5),
}));

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 사용자 인증 상태 확인
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchNotifications(currentUser.uid);
            } else {
                // 로그인되지 않은 경우 로그인 페이지로 리디렉션
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // 알림 가져오기
    const fetchNotifications = async (userId) => {
        try {
            // Firestore에서 실시간으로 알림 데이터 가져오기
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            // 실시간 리스너 설정
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const notificationsList = [];
                querySnapshot.forEach((doc) => {
                    notificationsList.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setNotifications(notificationsList);
                setLoading(false);
            });

            // 컴포넌트 언마운트시 리스너 해제
            return unsubscribe;
        } catch (error) {
            console.error('알림 가져오기 오류:', error);
            setLoading(false);
        }
    };

    // 알림 읽음 처리
    const markAsRead = async (notificationId) => {
        try {
            const notificationRef = doc(firestore, 'notifications', notificationId);
            await updateDoc(notificationRef, {
                isRead: true
            });
        } catch (error) {
            console.error('알림 읽음 처리 오류:', error);
        }
    };

    // 알림 클릭 핸들러
    const handleNotificationClick = (notification) => {
        // 알림을 읽음으로 표시
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // 알림 유형에 따라 다른 페이지로 이동
        switch (notification.type) {
            case 'photo_completed':
                navigate(`/photos/${notification.photoId}`);
                break;
            case 'friend_request':
                navigate(`/friends`);
                break;
            case 'new_post':
                navigate(`/feed/${notification.postId}`);
                break;
            case 'new_comment':
                navigate(`/feed/${notification.postId}?comment=${notification.commentId}`);
                break;
            default:
                // 기본 동작
                navigate('/');
        }
    };

    // 탭 변경 핸들러
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // 알림 유형에 따른 아이콘 반환
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'photo_completed':
                return (
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                        <span className="material-icons-outlined">photo_camera</span>
                    </Avatar>
                );
            case 'friend_request':
                return (
                    <Avatar sx={{ bgcolor: 'info.light' }}>
                        <span className="material-icons-outlined">person_add</span>
                    </Avatar>
                );
            case 'new_post':
                return (
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <span className="material-icons-outlined">post_add</span>
                    </Avatar>
                );
            case 'new_comment':
                return (
                    <Avatar sx={{ bgcolor: 'secondary.light' }}>
                        <span className="material-icons-outlined">comment</span>
                    </Avatar>
                );
            default:
                return (
                    <Avatar sx={{ bgcolor: 'grey.500' }}>
                        <span className="material-icons-outlined">notifications</span>
                    </Avatar>
                );
        }
    };

    // 알림 메시지 생성
    const getNotificationMessage = (notification) => {
        switch (notification.type) {
            case 'photo_completed':
                return '헤어스타일 AI 생성이 완료되었습니다.';
            case 'friend_request':
                return `${notification.senderName}님이 친구 요청을 보냈습니다.`;
            case 'new_post':
                return `${notification.senderName}님이 새 게시물을 업로드했습니다.`;
            case 'new_comment':
                return `${notification.senderName}님이 회원님의 게시물에 댓글을 남겼습니다.`;
            default:
                return '새로운 알림이 있습니다.';
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (timestamp) => {
        if (!timestamp) return '';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간 전`;
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
        }
    };

    // 현재 탭에 따른 알림 필터링
    const filteredNotifications = notifications.filter(notification => {
        if (tabValue === 0) return true; // 전체 알림
        if (tabValue === 1) return !notification.isRead; // 읽지 않은 알림
        if (tabValue === 2) return notification.isRead; // 읽은 알림
        return true;
    });

    return (
        <Box sx={{ py: 6 }}>
            <PageContainer maxWidth="md">
                {/* 페이지 제목 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <PageTitle variant="h2">
                        알림
                    </PageTitle>
                    {!loading && notifications.length > 0 && (
                        <Badge
                            badgeContent={notifications.filter(n => !n.isRead).length}
                            color="error"
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: '22px', minWidth: '22px' } }}
                        >
                            <span className="material-icons-outlined" style={{ fontSize: '28px' }}>notifications</span>
                        </Badge>
                    )}
                </Box>

                {/* 알림 카드 */}
                <NotificationCard elevation={0}>
                    {/* 알림 필터 탭 */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="전체" />
                        <Tab
                            label={
                                <Badge
                                    badgeContent={notifications.filter(n => !n.isRead).length}
                                    color="error"
                                    sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: '16px', minWidth: '16px' } }}
                                >
                                    읽지 않음
                                </Badge>
                            }
                        />
                        <Tab label="읽음" />
                    </Tabs>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredNotifications.length > 0 ? (
                        <List sx={{ width: '100%', p: 0 }}>
                            {filteredNotifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <NotificationItem
                                        isRead={notification.isRead}
                                        onClick={() => handleNotificationClick(notification)}
                                        button
                                    >
                                        <ListItemAvatar>
                                            {getNotificationIcon(notification.type)}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" component="span" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>
                                                        {getNotificationMessage(notification)}
                                                    </Typography>
                                                    {!notification.isRead && (
                                                        <StatusChip
                                                            isRead={false}
                                                            label="NEW"
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <NotificationTime>
                                                    {formatDate(notification.createdAt)}
                                                </NotificationTime>
                                            }
                                        />
                                        <IconButton edge="end">
                                            <span className="material-icons-outlined">chevron_right</span>
                                        </IconButton>
                                    </NotificationItem>
                                    {index < filteredNotifications.length - 1 && (
                                        <Divider variant="inset" component="li" />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <EmptyNotification>
                            <span className="material-icons-outlined" style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}>
                                notifications_off
                            </span>
                            <Typography variant="h6" color="text.secondary">
                                알림이 없습니다
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                새로운 알림이 도착하면 여기에 표시됩니다
                            </Typography>
                        </EmptyNotification>
                    )}
                </NotificationCard>
            </PageContainer>
        </Box>
    );
};

export default NotificationPage;