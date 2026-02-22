
# Card Hover Effects

Reusable CSS card hover effects for your frontend projects.

## Effects Included
- **Shadow Elevation** (`card-shadow`): Card shadow increases on hover.
- **Scale Up** (`card-scale`): Card slightly grows on hover.
- **Border Color Change** (`card-border`): Card border color changes on hover.
- **Lift & Glow** (`card-liftglow`): Card lifts and glows on hover.
- **Rotate** (`card-rotate`): Card rotates a few degrees on hover.
- **Content Reveal** (`card-contentreveal`): Extra content slides up or fades in on hover.
- **Blur** (`card-blur`): Card image blurs on hover.
- **Flip 3D** (`card-flip3d`): Card flips in 3D, showing front and back content.
- **Rotate Content** (`card-content-rotate`): Only the inner content (image/text) rotates on hover, while the card box remains fixed. This is a subtle 3D effect, not a full flip.

## How to Use
1. **Import the CSS file for the effect you want:**
    ```html
    <link rel="stylesheet" href="shadow.css">
    <link rel="stylesheet" href="scale.css">
    <link rel="stylesheet" href="border.css">
    <link rel="stylesheet" href="liftglow.css">
    <link rel="stylesheet" href="rotate.css">
    <link rel="stylesheet" href="contentreveal.css">
    <link rel="stylesheet" href="blur.css">
    <link rel="stylesheet" href="flip3d.css">
    <link rel="stylesheet" href="contentrotate.css">
    ```
    (Adjust the path as needed)

2. **Add the corresponding class to your card:**
    ```html
    <div class="card card-shadow">Shadow Elevation</div>
    <div class="card card-scale">Scale Up</div>
    <div class="card card-border">Border Color Change</div>
    <div class="card card-liftglow">Lift & Glow</div>
    <div class="card card-rotate">Rotate</div>
    <div class="card card-contentreveal">
       Card Content
       <div class="card-extra">Revealed on hover!</div>
    </div>
    <div class="card card-blur">
       <div class="card-blur-imgwrap">
          <img src="..." alt="Card Image">
       </div>
       <h2>Blur</h2>
       <p>Blurs image on hover.</p>
    </div>
    <div class="card card-flip3d">
       <div class="flip3d-inner">
          <div class="flip3d-front">Front Content</div>
          <div class="flip3d-back">Back Content</div>
       </div>
    </div>
    <div class="card card-content-rotate">
       <div class="card-content-rotate-inner">
          <img src="..." alt="Card Image">
          <h2>Rotate Content</h2>
          <p>Only the content rotates on hover.</p>
       </div>
    </div>
    ```

## Demo
See `index.html` in this folder for a live demo of all effects.