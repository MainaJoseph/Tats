import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageType {
  name: string;
  href: string;
}

interface BreadcrumbComponentProps {
  pages: PageType[];
}

const BreadcrumbComponent: React.FC<BreadcrumbComponentProps> = ({ pages }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === pages.length - 1 ? (
                <BreadcrumbPage>{page.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={page.href}>{page.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < pages.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
