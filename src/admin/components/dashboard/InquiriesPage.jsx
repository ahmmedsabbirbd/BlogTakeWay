// InquiriesPage.jsx
import { __ } from '@wordpress/i18n';
import React, { useState, useEffect, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Button,
    Typography,
    Chip,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import ChatWidget from '../../../components/ChatWidget';
import '../../styles/CustomerInquiries.scss';

const InquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [totalRows, setTotalRows] = useState(0);

    // Filter states
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isWooCommerceActive, setIsWooCommerceActive] = useState(false);

    const chatWidgetRef = useRef(null);

    useEffect(() => {
        isWooCommerceActive && loadInquiries();
    }, [page, pageSize, startDate, endDate, statusFilter, searchQuery, isWooCommerceActive]);

    
    useEffect(() => {
        setIsWooCommerceActive(!!window?.AiskSettings?.isWooCommerceActive);
    }, []);

    const loadInquiries = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: page + 1,
                per_page: pageSize,
                status: statusFilter !== 'all' ? statusFilter : '',
                search: searchQuery,
                start_date: startDate,
                end_date: endDate
            });

            const restUrl = window?.wpApiSettings?.root || window?.AiskData?.apiUrl || '/wp-json/';
            const nonce = window?.wpApiSettings?.nonce || window?.AiskData?.nonce;

            if (!nonce) {
                throw new Error(__('Authentication token missing. Please refresh the page.', 'promo-bar-x'));
            }

            const response = await fetch(
                `${restUrl}aisk/v1/inquiries?${queryParams.toString()}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': nonce
                    },
                    credentials: 'same-origin'
                }
            );
            const data = await response.json();
            setInquiries(data.inquiries);
            setTotalRows(data.total);
        } catch (error) {
            console.error('Error loading inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewChat = (chat) => {
        setSelectedChat(null);
        localStorage.removeItem('wooai_conversation_id');

        setTimeout(() => {
            localStorage.setItem('wooai_conversation_id', chat.conversation_id);
            setSelectedChat(chat);
            if (chatWidgetRef.current) {
                chatWidgetRef.current.open();
            }
        }, 0);
    };

    const handleViewDetails = (id) => {
        window.location.href = `${window.AiskData.adminUrl}?page=aisk-inquiries&view=details&id=${id}`;
    };

    const handleStatusUpdate = async (inquiryId, newStatus) => {
        try {
            const restUrl = window?.wpApiSettings?.root || window?.AiskData?.apiUrl || '/wp-json/';
            const nonce = window?.wpApiSettings?.nonce || window?.AiskData?.nonce;

            if (!nonce) {
                throw new Error(__('Authentication token missing. Please refresh the page.', 'promo-bar-x'));
            }

            const response = await fetch(
                `${restUrl}aisk/v1/inquiries/${inquiryId}/status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': nonce
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (response.ok) {
                isWooCommerceActive && loadInquiries();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setStatusFilter('all');
        setSearchQuery('');
        setPage(0);
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { color: 'warning', label: __('Pending', 'promo-bar-x') },
            in_progress: { color: 'info', label: __('In Progress', 'promo-bar-x') },
            resolved: { color: 'success', label: __('Resolved', 'promo-bar-x') }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const columns = [
        {
            field: 'id',
            headerName: __('ID', 'promo-bar-x'),
            width: 70
        },
        {
            field: 'order_number',
            headerName: __('Order #', 'promo-bar-x'),
            width: 100
        },
        {
            field: 'customer_email',
            headerName: __('Email', 'promo-bar-x'),
            width: 200
        },
        {
            field: 'customer_phone',
            headerName: __('Phone', 'promo-bar-x'),
            width: 130
        },
        {
            field: 'note',
            headerName: __('Inquiry', 'promo-bar-x'),
            width: 300,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: __('Status', 'promo-bar-x'),
            width: 150,
            renderCell: (params) => (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                        value={params.value}
                        onChange={(e) => handleStatusUpdate(params.row.id, e.target.value)}
                        size="small"
                        sx={{
                            '&.Mui-focused': {
                                backgroundColor: 'transparent'
                            }
                        }}
                    >
                        <MenuItem value="pending">
                            {getStatusChip('pending')}
                        </MenuItem>
                        <MenuItem value="in_progress">
                            {getStatusChip('in_progress')}
                        </MenuItem>
                        <MenuItem value="resolved">
                            {getStatusChip('resolved')}
                        </MenuItem>
                    </Select>
                </FormControl>
            )
        },
        {
            field: 'created_at',
            headerName: __('Date', 'promo-bar-x'),
            width: 180,
            valueFormatter: (params) => {
                let utcDateString = params.value;
                if (utcDateString && !utcDateString.includes('T')) {
                    utcDateString = utcDateString.replace(' ', 'T');
                }
                if (utcDateString && !utcDateString.endsWith('Z')) {
                    utcDateString += 'Z';
                }
                const utcDate = new Date(utcDateString);

                if (isNaN(utcDate)) {
                    return 'Invalid Date';
                }

                // Get the user's time zone abbreviation and name
                const localeString = utcDate.toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short',
                });
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                return `${localeString} (${tz})`;
            }
        },
        {
            field: 'actions',
            headerName: __('Actions', 'promo-bar-x'),
            width: 200,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewChat(params.row)}
                    >
                        View Chat
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(params.row.id)}
                    >
                        Details
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }} className="admin-customer-inquiries">
            <Typography variant="h4" component="h1" gutterBottom>
                {__('Customer Inquiries', 'promo-bar-x')}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
                <TextField
                    type="date"
                    label={__('Start Date', 'promo-bar-x')}
                    className="admin-customer-inquiries__input-date-pic"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 150 }}
                />

                <TextField
                    type="date"
                    label={__('End Date', 'promo-bar-x')}
                    className="admin-customer-inquiries__input-date-pic"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 150 }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel className="admin-customer-inquiries__input-select-label">{__('Status', 'promo-bar-x')}</InputLabel>
                    <Select
                        className="admin-customer-inquiries__input-select"
                        value={statusFilter}
                        label={__('Status', 'promo-bar-x')}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">{__('All', 'promo-bar-x')}</MenuItem>
                        <MenuItem value="pending">{__('Pending', 'promo-bar-x')}</MenuItem>
                        <MenuItem value="in_progress">{__('In Progress', 'promo-bar-x')}</MenuItem>
                        <MenuItem value="resolved">{__('Resolved', 'promo-bar-x')}</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    className="admin-customer-inquiries__input-search"
                    label={__('Search', 'promo-bar-x')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={__('Order #, Email, Phone...', 'promo-bar-x')}
                    sx={{ width: 250 }}
                />

                <Button
                    variant="outlined"
                    className="admin-customer-inquiries__button"
                    onClick={handleResetFilters}
                >
                    {__('Reset Filters', 'promo-bar-x')}
                </Button>
            </Stack>

            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={inquiries}
                    columns={columns}
                    pagination
                    page={page}
                    pageSize={pageSize}
                    rowCount={totalRows}
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    loading={isWooCommerceActive ? loading : false}
                    disableSelectionOnClick
                /> 
            </Box>

            {selectedChat && (
                <ChatWidget
                    ref={chatWidgetRef}
                    key={selectedChat.conversation_id}
                    conversationId={selectedChat.conversation_id}
                    readOnly={true}
                />
            )}
        </Box>
    );
};

export default InquiriesPage;