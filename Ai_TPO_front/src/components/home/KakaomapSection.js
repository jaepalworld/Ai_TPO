import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Rating,
    Skeleton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import NearMeIcon from '@mui/icons-material/NearMe';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RefreshIcon from '@mui/icons-material/Refresh';

const KakaomapSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [salons, setSalons] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalon, setSelectedSalon] = useState(null);
    const [error, setError] = useState(null);
    const mapContainerRef = useRef(null);

    // API 키 가져오기
    const KAKAO_MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

    // 카카오 지도 스크립트 로드
    useEffect(() => {
        // 이미 카카오 맵이 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            initMap();
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        // https:// 프로토콜 명시적으로 추가 및 appkey 대신 큰따옴표로 감싼 형태 사용
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                if (userLocation) {
                    initMap();
                }
            });
        };

        script.onerror = (e) => {
            console.error("카카오 지도 스크립트 로딩 오류:", e);
            setError('카카오 지도를 불러오는데 실패했습니다. 다시 시도해주세요.');
            setLoading(false);
        };

        return () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, [KAKAO_MAP_API_KEY]);

    // 사용자 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // 기본 위치 설정 (서울 중심)
                    setUserLocation({ lat: 37.5665, lng: 126.9780 });
                    setError('위치 정보를 가져올 수 없습니다. 기본 위치(서울)를 사용합니다.');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser');
            // 기본 위치 설정 (서울 중심)
            setUserLocation({ lat: 37.5665, lng: 126.9780 });
            setError('이 브라우저는 위치 서비스를 지원하지 않습니다. 기본 위치(서울)를 사용합니다.');
        }
    }, []);

    // 사용자 위치가 변경되면 지도 초기화
    useEffect(() => {
        if (userLocation && window.kakao && window.kakao.maps) {
            initMap();
        }
    }, [userLocation]);

    // 지도 초기화
    const initMap = () => {
        if (!userLocation || !mapContainerRef.current) return;

        try {
            const mapOption = {
                center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
                level: 4
            };

            // 이전 마커 제거
            if (markers.length > 0) {
                markers.forEach(marker => marker.setMap(null));
                setMarkers([]);
            }

            const newMap = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
            setMap(newMap);

            // 사용자 위치 마커 추가
            const userMarker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
                map: newMap
            });

            // 내 위치 표시 커스텀 오버레이
            const userContent = document.createElement('div');
            userContent.className = 'user-marker';
            userContent.innerHTML = '내 위치';
            userContent.style.color = theme.palette.primary.main;
            userContent.style.background = '#fff';
            userContent.style.padding = '5px 10px';
            userContent.style.borderRadius = '4px';
            userContent.style.fontSize = '12px';
            userContent.style.fontWeight = 'bold';
            userContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

            new window.kakao.maps.CustomOverlay({
                map: newMap,
                position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
                content: userContent,
                yAnchor: 2.5
            });

            // 주변 미용실 검색
            searchNearbySalons(newMap, userLocation);
        } catch (error) {
            console.error('Map initialization error:', error);
            setError('지도를 초기화하는데 문제가 발생했습니다.');
            setLoading(false);
        }
    };

    // 주변 미용실 검색
    const searchNearbySalons = (map, location) => {
        if (!map || !location) return;
        setLoading(true);

        try {
            const places = new window.kakao.maps.services.Places();

            places.keywordSearch('미용실', (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const bounds = new window.kakao.maps.LatLngBounds();
                    const newMarkers = [];

                    // 검색 결과 처리
                    const salonsData = result.map(place => {
                        const position = new window.kakao.maps.LatLng(place.y, place.x);

                        // 마커 생성
                        const marker = new window.kakao.maps.Marker({
                            map: map,
                            position: position
                        });

                        // 마커 클릭 이벤트
                        window.kakao.maps.event.addListener(marker, 'click', () => {
                            setSelectedSalon(place);

                            // 선택된 위치로 지도 이동
                            map.panTo(position);
                        });

                        newMarkers.push(marker);
                        bounds.extend(position);

                        // 거리 계산
                        const distance = calculateDistance(
                            location.lat, location.lng,
                            parseFloat(place.y), parseFloat(place.x)
                        );

                        // 임의의 별점과 리뷰 수 생성 (실제로는 API에서 가져와야 함)
                        const randomRating = (3.5 + Math.random() * 1.5).toFixed(1);
                        const randomReviews = Math.floor(Math.random() * 50) + 5;

                        return {
                            ...place,
                            distance: distance,
                            rating: parseFloat(randomRating),
                            reviews: randomReviews
                        };
                    });

                    // 거리순 정렬
                    const sortedSalons = salonsData.sort((a, b) => a.distance - b.distance);

                    setSalons(sortedSalons);
                    setMarkers(newMarkers);

                    // 지도 영역 설정
                    if (sortedSalons.length > 0) {
                        map.setBounds(bounds);
                    }

                    setLoading(false);
                    setError(null);
                } else {
                    console.error('Places search failed', status);
                    setError('주변 미용실을 검색하는데 실패했습니다.');
                    setSalons([]);
                    setLoading(false);
                }
            }, {
                location: new window.kakao.maps.LatLng(location.lat, location.lng),
                radius: 3000,
                sort: window.kakao.maps.services.SortBy.DISTANCE
            });
        } catch (error) {
            console.error('Search error:', error);
            setError('검색 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    // 거리 계산 함수 (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구 반경 (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    // 검색어 변경 처리
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 처리
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;

        try {
            // 검색어로 미용실 필터링
            const filteredSalons = salons.filter(salon =>
                salon.place_name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredSalons.length > 0) {
                setSalons(filteredSalons);

                // 선택된 미용실을 중심으로 지도 이동
                const firstSalon = filteredSalons[0];
                const moveLatLon = new window.kakao.maps.LatLng(firstSalon.y, firstSalon.x);
                map.setCenter(moveLatLon);
                map.setLevel(3);
            } else {
                setError(`"${searchTerm}" 검색 결과가 없습니다.`);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError('검색 중 오류가 발생했습니다.');
        }
    };

    // 전체 보기 버튼 클릭 처리
    const handleShowAll = () => {
        setSearchTerm('');
        setSelectedSalon(null);
        setError(null);
        if (userLocation && map) {
            searchNearbySalons(map, userLocation);
        }
    };

    // 필터 처리 함수들
    const handleFilterByDistance = (maxDistance) => {
        if (salons.length === 0) return;

        const filteredSalons = salons.filter(salon => salon.distance <= maxDistance);
        if (filteredSalons.length > 0) {
            setSalons(filteredSalons);
        } else {
            setError(`${maxDistance}km 이내에 미용실이 없습니다.`);
        }
    };

    const handleFilterByRating = () => {
        if (salons.length === 0) return;

        const sortedSalons = [...salons].sort((a, b) => b.rating - a.rating);
        setSalons(sortedSalons);
    };

    const handleFilterByReviews = () => {
        if (salons.length === 0) return;

        const sortedSalons = [...salons].sort((a, b) => b.reviews - a.reviews);
        setSalons(sortedSalons);
    };

    // 거리 포맷팅
    const formatDistance = (distance) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)}m`;
        }
        return `${distance.toFixed(1)}km`;
    };

    // 현재 위치 재설정 및 지도 새로고침
    const handleRefreshLocation = () => {
        setLoading(true);
        setError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    // userLocation이 업데이트되면 useEffect에서 지도를 다시 초기화합니다
                },
                (error) => {
                    console.error('Geolocation error on refresh:', error);
                    setError('위치 정보를 새로 가져올 수 없습니다.');
                    setLoading(false);
                }
            );
        } else {
            setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 4
                    }}
                >
                    내 주변 헤어샵 찾기
                </Typography>

                <Typography variant="h6" component="p" align="center" sx={{ mb: 5 }}>
                    현재 위치를 기반으로 가까운 미용실을 찾아보세요.
                    AI 스타일을 체험한 후 실제 시술을 받을 수 있는 주변 헤어샵을 추천해 드립니다.
                </Typography>

                {/* 검색창 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: '70%', md: '50%' },
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '50px',
                            overflow: 'hidden'
                        }}
                        onSubmit={handleSearch}
                    >
                        <InputAdornment position="start" sx={{ pl: 2 }}>
                            <LocationOnIcon color="primary" />
                        </InputAdornment>
                        <TextField
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="미용실 이름으로 검색"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                        />
                        <IconButton
                            type="submit"
                            sx={{ p: '10px' }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>

                {/* 필터 칩 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    <Chip
                        icon={<NearMeIcon />}
                        label="전체 보기"
                        onClick={handleShowAll}
                        variant="outlined"
                        color="primary"
                    />
                    <Chip
                        label="500m 이내"
                        variant="outlined"
                        onClick={() => handleFilterByDistance(0.5)}
                    />
                    <Chip
                        label="1km 이내"
                        variant="outlined"
                        onClick={() => handleFilterByDistance(1)}
                    />
                    <Chip
                        label="별점 높은 순"
                        variant="outlined"
                        onClick={handleFilterByRating}
                    />
                    <Chip
                        label="리뷰 많은 순"
                        variant="outlined"
                        onClick={handleFilterByReviews}
                    />
                    <Chip
                        icon={<RefreshIcon />}
                        label="위치 새로고침"
                        onClick={handleRefreshLocation}
                        variant="outlined"
                        color="secondary"
                    />
                </Box>

                {/* 에러 메시지 표시 */}
                {error && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: 'error.light',
                            color: 'error.dark',
                            borderRadius: 2,
                            textAlign: 'center'
                        }}
                    >
                        <Typography>{error}</Typography>
                    </Paper>
                )}

                {/* 지도와 목록 컨테이너 */}
                <Grid container spacing={3}>
                    {/* 지도 */}
                    <Grid item xs={12} md={7}>
                        <Paper
                            elevation={3}
                            sx={{
                                height: '500px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <Box
                                ref={mapContainerRef}
                                sx={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            {loading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                    }}
                                >
                                    <Typography>지도를 불러오는 중...</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* 미용실 목록 */}
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={3}
                            sx={{
                                height: '500px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: theme.palette.primary.light,
                                    color: 'white'
                                }}
                            >
                                <Typography variant="h6">
                                    주변 헤어샵 {salons.length}개
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    p: 2
                                }}
                            >
                                {loading ? (
                                    // 로딩 스켈레톤
                                    Array.from(new Array(3)).map((_, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Skeleton variant="text" height={30} />
                                            <Skeleton variant="text" />
                                            <Skeleton variant="rectangular" height={60} />
                                        </Box>
                                    ))
                                ) : salons.length > 0 ? (
                                    // 미용실 목록
                                    salons.map((salon, index) => (
                                        <Card
                                            key={salon.id || index}
                                            sx={{
                                                mb: 2,
                                                boxShadow: selectedSalon && selectedSalon.id === salon.id ?
                                                    '0 0 0 2px ' + theme.palette.primary.main : 'none',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                            onClick={() => {
                                                setSelectedSalon(salon);
                                                if (map) {
                                                    const moveLatLon = new window.kakao.maps.LatLng(salon.y, salon.x);
                                                    map.setCenter(moveLatLon);
                                                    map.setLevel(3);
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ pb: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                        {salon.place_name}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        icon={<NearMeIcon fontSize="small" />}
                                                        label={formatDistance(salon.distance)}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                                    <Rating
                                                        name={`rating-${salon.id || index}`}
                                                        value={salon.rating}
                                                        precision={0.5}
                                                        readOnly
                                                        size="small"
                                                    />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        {salon.reviews} 리뷰
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {salon.address_name || salon.road_address_name}
                                                </Typography>
                                            </CardContent>

                                            <CardActions sx={{ pt: 0 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<PhoneIcon />}
                                                    href={`tel:${salon.phone}`}
                                                >
                                                    전화
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<DirectionsIcon />}
                                                    href={`https://map.kakao.com/link/to/${salon.place_name},${salon.y},${salon.x}`}
                                                    target="_blank"
                                                >
                                                    길찾기
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<FavoriteBorderIcon />}
                                                >
                                                    저장
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    ))
                                ) : (
                                    // 결과 없음
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <Typography color="text.secondary">
                                            주변에 미용실이 없습니다. 다른 위치에서 검색해보세요.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 선택된 미용실 상세 정보 */}
                {selectedSalon && (
                    <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: '16px' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`https://source.unsplash.com/random/300x200/?hair,salon&sig=${selectedSalon.id || Math.random()}`} // 임시 이미지
                                    alt={selectedSalon.place_name}
                                    sx={{ borderRadius: '8px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {selectedSalon.place_name}
                                    </Typography>
                                    <IconButton color="primary">
                                        <FavoriteBorderIcon />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Rating
                                        value={selectedSalon.rating}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {selectedSalon.reviews} 리뷰
                                    </Typography>
                                </Box>

                                <Typography variant="body1" paragraph>
                                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    {selectedSalon.address_name || selectedSalon.road_address_name}
                                </Typography>

                                {selectedSalon.phone && (
                                    <Typography variant="body1" paragraph>
                                        <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                        {selectedSalon.phone}
                                    </Typography>
                                )}

                                <Typography variant="body2" color="text.secondary" paragraph>
                                    현재 위치에서 {formatDistance(selectedSalon.distance)} 거리에 있습니다.
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DirectionsIcon />}
                                        href={`https://map.kakao.com/link/to/${selectedSalon.place_name},${selectedSalon.y},${selectedSalon.x}`}
                                        target="_blank"
                                        sx={{ mr: 2 }}
                                    >
                                        길찾기
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<PhoneIcon />}
                                        href={`tel:${selectedSalon.phone}`}
                                    >
                                        전화하기
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* 안내 메시지 */}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    * 미용실 정보는 실시간 데이터와 다를 수 있습니다. 정확한 정보는 전화로 확인해 주세요.
                </Typography>
            </Container>
        </Box>
    );
};

export default KakaomapSection;