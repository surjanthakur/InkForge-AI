def pdf_template_structure(
    post_user: str,
    post_created_fmt: str,
    post_title: str,
    post_content: str,
):
    html_template = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">

<style>

* {{
    margin:0;
    padding:0;
    box-sizing:border-box;
}}

body {{
    font-family: "Inter", sans-serif;
    color:#1a1a1a;
    background:#ffffff;
    padding:60px 70px;
}}

.container {{
    max-width:720px;
    margin:0 auto;
}}

.header {{
    margin-bottom:28px;
}}

.meta {{
    font-size:12px;
    letter-spacing:0.04em;
    text-transform:uppercase;
    color:#6b6b6b;
    margin-bottom:14px;
}}

.meta span {{
    margin-right:12px;
}}

.title {{
    font-family:"Playfair Display", serif;
    font-size:30px;
    font-weight:700;
    line-height:1.35;
    margin-bottom:18px;
}}

.divider {{
    width:60px;
    height:2px;
    background:#111;
    margin-bottom:32px;
}}

.content {{
    font-size:15px;
    line-height:1.8;
}}

.content p {{
    margin-bottom:16px;
}}

.content h2 {{
    font-family:"Playfair Display", serif;
    font-size:20px;
    margin-top:28px;
    margin-bottom:10px;
}}

.content h3 {{
    font-family:"Playfair Display", serif;
    font-size:17px;
    margin-top:22px;
    margin-bottom:8px;
}}

.content ul,
.content ol {{
    padding-left:22px;
    margin-bottom:16px;
}}

.content li {{
    margin-bottom:6px;
}}

.content strong {{
    font-weight:600;
}}

.footer {{
    margin-top:60px;
    font-size:12px;
    color:#888;
    text-align:center;
    border-top:1px solid #e5e5e5;
    padding-top:14px;
}}

</style>
</head>

<body>

<div class="container">

    <div class="header">

        <div class="meta">
            <span><strong>Author:</strong> {post_user}</span>
            <span>|</span>
            <span><strong>Published:</strong> {post_created_fmt}</span>
        </div>

        <div class="title">
            {post_title}
        </div>

        <div class="divider"></div>

    </div>

    <div class="content">
        {post_content}
    </div>

    <div class="footer">
        Generated Document
    </div>

</div>

</body>
</html>
"""
    return html_template
