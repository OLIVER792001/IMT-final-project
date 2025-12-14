import csv
import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

def convert_csv_to_xml():
    # 1. 设定路径
    # 获取当前脚本所在的绝对路径 (IMT/scripts/python/)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 推算 data 文件夹的路径 (往上退两级 ../../ 然后进入 data)
    csv_path = os.path.abspath(os.path.join(current_dir, '../../data/metadata.csv'))
    xml_path = os.path.abspath(os.path.join(current_dir, '../../data/metadata.xml'))

    print(f"正在读取 CSV 文件: {csv_path}")

    # 2. 创建 XML 的根节点 (比如叫 <catalog> 或 <artifacts>)
    root = ET.Element("catalog")

    try:
        # 3. 读取 CSV 文件
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            # 遍历 CSV 的每一行
            for row in reader:
                # 为每一行创建一个 <item> 节点
                item = ET.SubElement(root, "item")
                
                # 遍历这一行的每一列 (Title, Date, Description 等)
                for key, value in row.items():
                    # 处理一下 key，把空格替换成下划线，确保 XML 标签合法
                    # 例如 "image url" 变成 <image_url>
                    if key: # 确保 key 存在
                        tag_name = key.strip().replace(" ", "_").lower()
                        child = ET.SubElement(item, tag_name)
                        child.text = str(value).strip() # 填入内容

        # 4. 格式化 XML (让它缩进好看，不是挤在一行)
        xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")

        # 5. 写入 XML 文件
        with open(xml_path, "w", encoding="utf-8") as f:
            f.write(xml_str)

        print(f"成功！XML 文件已生成: {xml_path}")

    except FileNotFoundError:
        print("错误：找不到 metadata.csv 文件，请检查 data 文件夹里是否有这个文件。")
    except Exception as e:
        print(f"发生未知错误: {e}")

if __name__ == "__main__":
    convert_csv_to_xml()