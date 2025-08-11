import pymysql
from pymysql.cursors import DictCursor

def get_liked_items(user_id: int):
    conn = pymysql.connect(
        host='localhost',
        port=3306,
        user='ssafy',
        password='ssafy1234',
        db='test',
        charset='utf8mb4'
    )
    # conn = pymysql.connect(
    #     host='ssafy-mysql-db.mysql.database.azure.com',
    #     port=3306,
    #     user='S13P12A402',
    #     password='mmPPHmgIAU',
    #     db='S13P12A402',
    #     charset='utf8mb4'
    # )
    print("Connected to MySQL database successfully.")
    
    results_by_type = {
        "NEWS": [],
        "PROJECT": [],
        "JOB": []
    }
    
    try:
        with conn.cursor(DictCursor) as cursor:
            # 1. Get liked NEWS from news table
            query_news = """
                SELECT n.description, n.title
                FROM news n
                JOIN liked_content lc ON n.id = lc.targetId
                WHERE lc.member_id = %s AND lc.type = 'NEWS'
            """
            cursor.execute(query_news, (user_id,))
            results_by_type["NEWS"] = cursor.fetchall()

            # 2. Get liked PROJECTS from project_post table
            query_projects = """
                SELECT p.title, p.content
                FROM project_post p
                JOIN liked_content lc ON p.id = lc.targetId
                WHERE lc.member_id = %s AND lc.type = 'PROJECT'
            """
            cursor.execute(query_projects, (user_id,))
            results_by_type["PROJECT"] = cursor.fetchall()

            # 3. Get liked JOBS from job table
            query_jobs = """
                SELECT j.title
                FROM job j
                JOIN liked_content lc ON j.id = lc.targetId
                WHERE lc.member_id = %s AND lc.type = 'JOB'
            """
            cursor.execute(query_jobs, (user_id,))
            results_by_type["JOB"] = cursor.fetchall()
            
            print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~SQL Query Result~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            print(results_by_type)
    finally:
        conn.close()
        
    return results_by_type