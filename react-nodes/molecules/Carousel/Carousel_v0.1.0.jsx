import { Carousel } from '@mantine/carousel'

export default function Carousel_v0_1_0(props) {
  if (!Array.isArray(props.children)) {
    console.warn('Carousel needs at least 2 children')
    return <></>
  }
  else return (
    <Carousel
      slideSize="15%"
      height={64}
      align="start"
      slideGap="md"
      loop
      slidesToScroll={5}
      withControls={false}
      {...props}
      sx={props.sx?.length && { ...props.sx[0] }}
    >
      {props.children.map(child => <Carousel.Slide>{child}</Carousel.Slide>)}
    </Carousel>
  )
}