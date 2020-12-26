export default function getWebviewContent(username: string) {
  return `
		<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vsChat</title>
    <style>

        body,
        html {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        * {
            padding: 0;
            margin: 0;
        }

        iframe {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: none;
        }
    </style>

</head>
<body>
    <iframe src="https://embed.tlk.io/vsChat?theme=theme--night&nickname=`+ username + `&custom_css_path=https://gistcdn.rawgit.org/Ademking/f44ffb899a278c1a66660110b985005e/1cc0ba1e0dc5ad49fce38419592dcb2bbf251afd/fix.css" frameborder="0"></iframe>
</body>
</html>
	`;
}
