def pdf_template_structure(
    post_user: str,
    post_created_fmt: str,
    type: str,
    post_title: str,
    post_content: str,
):
    html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: "Playfair Display", serif !important;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
            background: #ffffff;
            padding: 48px 44px;
            color: #1a1a1a;
        }}

        /* ── Outer card wrapper ── */
        .post-card {{
            border: 1.5px solid #1a1a1a;
            border-radius: 16px;
            overflow: hidden;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }}

        /* ── Meta pill: author · date · type ── */
        .meta-pill {{
            display: flex;
            align-items: center;
            gap: 32px;
            border: 1.5px solid #1a1a1a;
            border-radius: 50px;
            padding: 10px 28px;
            width: fit-content;
        }}

        .meta-pill span {{
            font-size: 13px;
            font-weight: 400;
            color: #1a1a1a;
            letter-spacing: 0.02em;
        }}

        .meta-pill .divider {{
            width: 1px;
            height: 14px;
            background: #1a1a1a;
            opacity: 0.3;
        }}

        /* ── Title box ── */
        .title-box {{
            border: 1.5px solid #1a1a1a;
            border-radius: 12px;
            padding: 20px 24px;
        }}

        .title-box h1 {{
            font-size: 22px;
            font-weight: 600;
            font-family: "Playfair Display", serif !important;
            color: #1a1a1a;
            line-height: 1.35;
        }}

        /* ── Content box ── */
        .content-box {{
            border: 1.5px solid #1a1a1a;
            border-radius: 12px;
            padding: 24px;
            min-height: 320px;
        }}

        .content-box p {{
            font-size: 14px;
            line-height: 1.8;
            color: #1a1a1a;
            margin-bottom: 12px;
            font-family: "Playfair Display", serif !important;
        }}

        .content-box p:last-child {{
            margin-bottom: 0;
        }}

        .content-box strong {{
            font-weight: 600;
        }}

        .content-box ul,
        .content-box ol {{
            padding-left: 20px;
            margin-bottom: 12px;
        }}

        .content-box li {{
            font-size: 14px;
            line-height: 1.8;
            color: #1a1a1a;
            font-family: "Playfair Display", serif !important;
        }}

        .content-box h2, .content-box h3 {{
            font-size: 16px;
            font-weight: 600;
            margin: 16px 0 8px;
            font-family: "Playfair Display", serif !important;
        }}
    </style>
</head>
<body>
    <div class="post-card">

        <!-- Meta row: author / date / post_type -->
        <div class="meta-pill">
            <span>{post_user}</span>
            <div class="divider"></div>
            <span>{post_created_fmt}</span>
            <div class="divider"></div>
            <span>{type}</span>
        </div>

        <!-- Title -->
        <div class="title-box">
            <h1>{post_title}</h1>
        </div>

        <!-- Content -->
        <div class="content-box">
            {post_content}
        </div>

    </div>
</body>
</html>
"""
    return html_template
