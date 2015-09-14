# Image Carousel

This app can be used to view images in a spinning carousel. The carousel will spin automatically, but when the user clicks one of the arrows (or one of the navigation-buttons), the carousel will spin toward that arrow/button. Furthermore the user can interact with the carousel bij clicking one of the images. For each item in the carousel an image and a caption can be specified. The contents of the carousel cannot be defined using the modeler, but should be configured using your application. In other words, the carousel can be adapted dynamically.
The images in the carousel will be scaled to fit the width and height of the carousel.

The image carousel comes in two flavors:

The Carousel widget shows images based on (generated) URLs retrieved from the domain model, for optimal performance. It cannot be constrained by the context however.
The Dataview Carousel shows images which are stored in the domain model (they should be or derive from System.Image). The images should be retrieved using the object related to a surrounding Dataview object.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Configuration
The Carousel widget can be placed anywhere in your forms. It does not require any context. The image attribute defined should always contain a URL pointing to the desired image.

The Dataview Carousel should be put inside a dataview. Its images are retrieved over an association. Therefor, the dataview object should have an N --- 0 associaton to the images to be displayed. The actual image displayed is determined by the relation to the caption attribute.

## Properties

### Carousel

#### Width
The width of the carousel in pixels

#### Height
The height of the carousel in pixels

#### Border width
Width of the border around the carousel.

#### Border Style
Style of the border around the carousel.

#### Border color
Color of the border around the carousel.

#### Navigation Color
The color of the image navigation.

#### Arrow Image URL Back
The url for the arrowimage to use for navigating back.

#### Arrow Image URL Fwd
The url for the arrowimage to use for navigating forward.

#### Use Image Navigation
Use the image navigation. If the delay is set to 0, the navigation will still show up.

#### Use Bullets
Use the bullets. (Not recommended for more than 6 images)

#### Location of the Bullets
The location of the image navigation

#### Delay
Delay until the carousel moves to the next image (in ms).

#### Duration
Duration of the transition effect (in ms)

#### Click Action
Microflow to be triggered when an image is clicked.

#### Entity
The entity which should be displayed in the carousel

#### Constraint
Constraint on the carousel entity.

#### Caption Attribute
The caption of a carousel item

#### Image URL attribute
The url of the image to be used.

#### Sort Attribute
This field is used to sort the images in the carousel, using ascending order.

### Dataview Carousel

#### Width
The width of the carousel in pixels

#### Height
The height of the carousel in pixels

#### Border width
Width of the border around the carousel.

#### Border Style
Style of the border around the carousel.

#### Border color
Color of the border around the carousel.

#### Navigation Color
The color of the image navigation.

#### Arrow Image URL Back
The url for the arrowimage to use for navigating back.

#### Arrow Image URL Fwd
The url for the arrowimage to use for navigating forward

#### Use Image Navigation
Use the image navigation. If the delay is set to 0, the navigation will still show up.

#### Use Bullets
Use the bullets. (Not recommended for more than 6 images)

#### Location of the Bullets
The location of the image navigation.

#### Delay
Delay until the carousel moves to the next image (in ms).

#### Duration
Duration of the transition effect (in ms)

#### Click Action
Microflow to be triggered when an image is clicked.

#### Entity
The entity which should be displayed in the carousel

#### Caption Attribute
The caption of a carousel item

#### Sort Attribute
This field is used to sort the images in the carousel, using ascending order.