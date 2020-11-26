# feieyun-node

Feieyun Printer Node

## Ticket Print Format

```
<BR> : Line break
<CUT> : Cutter command (active cutting, only effective when using cutter printer)
<LOGO> : Print LOGO command (provided that the LOGO picture is built in the machine in advance)
<PLUGIN> : Cash drawer or external audio command
<CB></CB> : Center to zoom in
<B></B> : Double the zoom
<C></C> : Centered
<L></L> : The font is doubled
<W></W> : The font is doubled
<QR></QR> : QR code (single order, only one QR code can be printed at most)
<RIGHT></RIGHT> : Align right
<BOLD></BOLD> : bold font
  Print barcode (one-dimensional barcode) and order layout to align, click to download the following function reference, if you have other technical questions, please join Feiye API open platform 5 group: 146903613.
```

## Label Print Format

```
<FEED> : paper feed
<SIZE>width,height</SIZE> :
set the width and height of the label paper, width label paper width (excluding backing paper), height label paper height (excluding backing paper), unit mm, such as <SIZE>30 ,20</SIZE>

<GAP>m,n</GAP> :
Set the vertical gap distance between two rolls of label paper, m the vertical distance between the two label papers 0≤m≤25.4(mm), n vertical gap offset n≤label paper Paper length, in mm,
such as <GAP>7.62,-2.54</GAP>

<DIRECTION>n</DIRECTION> :
Set the direction of paper output and print fonts during printing, n 0 or 1, it will be initialized to 0 value setting every time the device is restarted, 1: forward paper output, 0: reverse output Paper,
such as <DIRECTION>1</DIRECTION>

<IMG x="10" y="100"> : To
print a picture, it needs to be used in conjunction with the binary data of the uploaded img picture (one order can only be printed once), where the attribute x is the coordinate of the starting point in the horizontal direction (default is 0),
Attribute y is the starting point coordinate in the vertical direction (default is 0)

<QR x="10" y="100" e="L" w="5">QR code content</QR> :
Print the QR code, where the attribute x is the coordinate of the starting point in the horizontal direction (default is 0 ), the attribute y is the vertical starting point coordinate (default is 0), the attribute e is the error correction level:
L 7%M 15%Q 25%H 30% (the default is K), the attribute w is the width of the QR code (default For 5)

<TEXT x="10" y="100" font="12" w="2" h="2" r="0">Text content</TEXT> :
Print the text, where the attribute x starts from the horizontal direction The starting point coordinate (default is 0), the attribute y is the vertical starting point coordinate (default is 0), and the attribute font is the font:

1, 8×12 dot alphanumeric body
2, 12×20 dot alphanumeric body
3, 16×24 dot alphanumeric body
4, 24×32 dot alphanumeric body
5, 32×48 dot alphanumeric body
6, 14×19 dot alphanumeric OCR-B
7, 21×27 dot alphanumeric OCR-B
8, 14×25 dot alphanumeric OCR-A
9, 9×17 dot alphanumeric
10, 12×24 dot alphanumeric
11 , Traditional Chinese 24×24Font (big five code)
12. Simplified Chinese 24×24Font (GB code)
13. Korean 24×24Font (KS code) The

default is 12 Simplified Chinese 24×24Font (GB code), the attribute w is the text width Magnification 1-10 (default is 1), attribute h is the height of the text, magnification 1-10
attribute r is the rotation angle of the text (clockwise):
0 0 degrees
90 90 degrees
180 180 degrees
270 270 degrees
(The default is 0)

<BC128 x="10" y="100" h="80" s="1" r="0" n="1" w="1">12345678</BC128>：
Print code128 one-dimensional code, Where the attribute x is the
coordinate of the starting point in the horizontal direction (default is 0), the attribute y is the coordinate of the starting point in the vertical direction (the default is 0), whether the attribute s is readable by the human eye: 0 unrecognizable, 1 recognizable (default 1),
The attribute n is the width of the narrow bar, expressed in dots (default is 1), the attribute w is the width of the wide bar (default is 1), expressed in dots, and the attribute r is the text rotation angle
(clockwise):
0 0 degrees
90 90 degrees
180 180 degrees
270 270 degrees
(default is 0)

<BC39 x="10" y="100" h="80" s="1" r="0" n="1" w="1">12345678</BC39>：
Print code39 one-dimensional code, Where the attribute x is the
coordinate of the starting point in the horizontal direction (the default is 0), the attribute y is the coordinate of the starting point in the vertical direction (the default is 0), whether the attribute s is readable by the human eye: 0 unrecognizable, 1 recognizable (default 1), The attribute
n is the narrow bar width, expressed in dots (default is 1), the attribute w is the wide bar width (default is 2), expressed in dots, and the attribute r is the text rotation angle (clockwise
direction):
0 0 degrees
90 90 degrees
180 180 degrees
270 270 degrees
(default is 0)

<LOGO x="10" y="100"> :
Print LOGO command (provided that the LOGO picture is built in the machine in advance), where attribute x is the coordinate of the starting point in the horizontal direction (default is 0), and
attribute y is the starting point in the vertical direction Coordinates (default is 0)
To print an example of the order effect, click to download the following function reference. If you have other technical questions, please join the Fei Go API Open Platform 5 group: 146903613.
```

## Testing

Running with jest network error:

https://github.com/axios/axios/issues/1754#issuecomment-486924528
