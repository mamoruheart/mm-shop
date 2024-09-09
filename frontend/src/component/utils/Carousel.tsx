/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

export function DefaultCarousel(props:any)
{


    return (
        <Carousel autoPlay={true} animation='slide' duration={300} height={380} className='h-full w-full flex flex-col justify-center'>
            {
                props.images.map( (item: any, i: any) => <Item key={i} src={item} /> )
            }
        </Carousel>
    )
}

function Item(props:any)
{
    return (
        <Paper className="flex flex-row justify-center h-full items-center">
            <div className="bg-contain bg-center bg-no-repeat  w-full h-full" style={{backgroundImage: `url(${props.src})`}} ></div>
        </Paper>
    )
}