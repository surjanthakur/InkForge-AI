from weasyprint import HTML
import tempfile


def generate_post_pdf(post_data):
    html_template = f"""
    <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    line-height: 1.6;
                }}
                h1 {{
                    text-align: center;
                }}
            </style>
        </head>
        <body>
            <h1>{post.title}</h1>
            {post.content}
        </body>
    </html>
    """

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

    HTML(string=html_template).write_pdf(temp_file.name)

    return temp_file.name
