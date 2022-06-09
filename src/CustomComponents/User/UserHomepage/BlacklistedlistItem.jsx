import { CardActionArea } from '@mui/material';
import { CardContent } from '@mui/material';
import { Typography } from '@mui/material';
import { CardMedia } from '@mui/material';
import { Card } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import image from '../../Images/undraw_online_stats_0g94.png'


const classes = {
    root: {
        maxWidth: 345,

    },
    media: {
        height: 140,
    },
    cardItemTitle: {
        fontSize: "16px",
        fontWeight: 800,
    },
    cardItemSubTitle: {
        fontSize: "14px",
        fontWeight: 600,
    },
    cardContainTitle: {
        color: "rgba(0, 0, 0, 0.87)"
    }
}

const BlacklistedlistItem = ({ listitem, isLoading }) => {


    const navigate = useNavigate();


    return (


        <Card sx={classes.root} style={{ height: "100%", maxWidth: "100%" }} onClick={() => navigate(`/blacklist/${listitem._id}`)}>
            <CardActionArea>
                <CardMedia
                    style={{ height: "150px" }}
                    image={image}
                    title="Contemplative Reptile"
                />
                <CardContent sx={{ textAlign: "start" }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={classes.cardItemTitle} >
                        {listitem.vendorName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" sx={classes.cardItemSubTitle} >
                        <span style={classes.cardContainTitle}>Address:</span> {listitem?.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" sx={classes.cardItemSubTitle} >
                        <span style={classes.cardContainTitle}>Reason:</span> {listitem?.reason}
                    </Typography>

                </CardContent>
            </CardActionArea>

        </Card>




    )
}

export default BlacklistedlistItem;




